#!/usr/bin/perl
############################################################################
#
#   (c) Markus Wolf, 1998
#
############################################################################
#
# wolfmail.cgi
# COPYRIGHT NOTICE                                                           
# Copyright 1998 Markus Wolf     
# All Rights Reserved.                     
# EMail: perl@perl-archiv.de
# URL  : http://www.perl-archiv.de  
#                                                                            
# wolfmail.cgi darf von jedermann kostenlos benutzt und ge”ndert werden, solange
# dieser Copyright-Verweis und die restlichen Kommentare erhalten bleiben. Mit
# dem Einsatz dieses Skripts akzeptieren Sie, daþ Markus Wolf von jeglicher
# Haftung und Gew”hrleistung hinsichtlich des Einsatzes befreit ist.
# 
# Der Verkauf dieses Skripts, auch in modifizierter Form, ist ohne vorherige
# Absprache ausdr¸cklich untersagt.
# (Mit anderen Worten: Bitte fragen Sie mich, bevor Sie versuchen, mit meinem
# Skript Geld zu verdienen.)
# 
# Um dieses Skript ¸ber das Internet oder irgendein anderes Medium
# weiterzuverbreiten, ben–tigen Sie vorher meine Erlaubnis. In jeden Fall
# m¸ssen der Copyright-Verweis und die restlichen Kommentare erhalten bleiben.
#
############################################################################
#
# <form name="mail" method=POST action="/cgi-bin/webmail/webmail.cgi">
# - Einbindung des Scriptes in das Formular
#
# <INPUT TYPE=HIDDEN name="redirect" value="http://www.girl.tv">
# - Diese Seite wird geladen, wenn die Mail gesendet wurde (muss nicht sein)
#
# <INPUT TYPE=HIDDEN name="recipient" size=25 value="you@mail.tv">
# - Empf”ngeradresse (muss sein)
#
# <INPUT TYPE=HIDDEN name="subject" value="mail">
# - Subject der Mail (muss nicht sein)
#
# <INPUT TYPE=HIDDEN name="required" value="aaName|acBewertung">
# - Felder die ausgef¸llt werden m¸ssen (muss nicht sein)
#
# <input type=text name="aaName" size=44 maxlength=140>
# - Name ds Absenders (sollte sein)
#
# <input type=text name="aaemail" size=44 maxlength=140></td>
# - E-Mail des Absenders (sollte sein)
#
# <textarea name="aaMail-Text" rows=10 cols=41 wrap=virtual></textarea>
# - Mailtext (Normales Feld - NAME: AusgabereihenfolgeFeldname)
#
# <input type=text name="ab,Bewertung" value="" size=44 maxlength=40>
# - Bewertung (Normales Feld - NAME: AusgabereihenfolgeFeldname)
#
# <input type=submit value="Mail abschicken">
# - Mail Abschicken
#
# Image-Buttons werden nun nicht mitgeschickt. Sie m¸ssen allerdings
# im Namen BUTTON nethalten:
# <input type=image src="bild.gif" border=0 name="button">
#
############################################################################

############################################################################
# Globale Variablen
############################################################################

 use strict ;
 my %MAILHEADER ;
 my %MAILFORM ;
 my @required ;
 my $mussfelder ;
 my $fehlfeld=0 ;


############################################################################
# Wechsel in das aktuelle Verzeichnis (CGI)
############################################################################

 my $base_dir = rindex ($0, "\\") ;
 $base_dir = rindex ($0, "/")  if ($base_dir < 0) ;
 my $script_dir = substr( $0, 0, $base_dir) ;
 chdir($script_dir) ;


############################################################################
# Variblendefinition (m¸ssen angepaþt werden)
############################################################################

#Pfad zum Mailprogramm (muss)
 my $mailprog = "/usr/lib/sendmail" ;

#Hostname (muss)
 my $hostname = "http://www.der-die-das.com" ;

#Das Ausgabeformula, wenn das Hidden-Feld REDIRECT nicht definiert ist
 my $stanback = "stdback.htm" ;

#Das Fehlerr¸ckgabeformular bei fehlenden Muþfeldern
 my $fehlback = "stdfehl.htm" ;

#Subjekt der Mail, wenn das Hidden-Feld nicht definiert ist
 my $stdsub = "Subject: Mail von $hostname";

#Pfad der R¸ckgabe- und Fehlerdateien (vom Script ausgehend)
 my $data = "data" ;

#Zeitverschiebung in Stunden (+ oder -)
 my $zeitverH=0 ;

#Offline-Modus zum Testen auf einem localen System, Mail wird in Datei geschrieben
#1=offline - 0=online
 my $offline = 1 ;

#File-Locking (Win9x=0 - sonst=1)
 my $lock = 0 ;


#############################################################################
# Hauptprogramm
#############################################################################

#Mail-Formular zerlegen
 &parse_form;

#Felder ¸berpr¸fen
 &check_required;

#R¸ckgabeseite nach der Mailzustellung
 &return_html;

#E-Mail senden
 &send_mail;


#############################################################################
# Unterprogramme
#############################################################################

#############################################################################
# Formulardaten werden ausgelesen
#############################################################################

sub parse_form {


my @feldpaare ;
my $buffer ;
my $feldnamen ;
my $wert ;
my $paar ;


read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});
$buffer =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack("C", hex($1))/eg;
@feldpaare = split(/&/, $buffer);
 

foreach $paar (@feldpaare) {

	($feldnamen, $wert) = split(/=/, $paar);

    $feldnamen =~ tr/+/ /;
    $wert =~ tr/+/ /;
    $wert =~ s/<!--(.|\n)*-->//g;


    if (	$feldnamen eq 'recipient' ||
		 	$feldnamen eq 'subject' ||
		  	$feldnamen eq 'redirect' && ($wert)) {
         
			$feldnamen =~ s/(\s+|\n)?,(\s+|\n)?/,/g;
		    $feldnamen =~ s/(\s+)?\n+(\s+)?//g;

			$wert =~ s/(\s+|\n)?,(\s+|\n)?/,/g;
		    $wert =~ s/(\s+)?\n+(\s+)?//g;

	 		$MAILHEADER{$feldnamen} = $wert;

	} elsif ($feldnamen eq 'required') {
        
			@required = split(/\|/ , $wert);

    } else {

			$MAILFORM{$feldnamen} = $wert if ($feldnamen !~ /button/i) ;

			if($feldnamen =~ /^[a-z][a-z]name\b/i) {

				$MAILHEADER{'realname'} = $wert ;

			} elsif ($feldnamen =~ /[a-z][a-z]email/i) {

				$MAILHEADER{'email'} = $wert ;
			}
    }
}


}



#############################################################################
# Mussfelder pr¸fen
#############################################################################

sub check_required {

 
my $require ;


foreach $require (@required) {
	
	if (!$MAILFORM{$require}) {

		$require =~ s/[a-z][a-z]//i ;
		$mussfelder.= "<font color=\"ff0000\">$require</font><br>" ;
       	$fehlfeld=1 ;
	}
      
}


}



#############################################################################
# R¸ckgabeseite ausgeben
#############################################################################

sub return_html {


my $line ;


if ($fehlfeld==1) {


	print "Content-Type: text/html\n\n" ;

	open(RE , "<Http://www.der-die-das.com/cgi-bin/webmail/data/$fehlback") ;
	
	while ($line=<RE>) {

		if ($line =~ /<!--mussfelder-->/i) {
			print "$mussfelder";
		} else {
			print $line ;
		}
	}
 
 	close(RE) ;

	exit ;


} else {


   	if ($MAILHEADER{'redirect'}) {

		print "Location: $MAILHEADER{'redirect'}\n\r\n\r" ;

   	} else {

		print "Content-Type: text/html\n\n" ;
		open(RE , "< Http://www.der-die-das.com/cgi-bin/webmail/data/$stanback") ;
		while (<RE>) {
			print "$_" ;
		}
 	 	close(RE) ;
   }

}


}



#############################################################################
# Mail verschicken
#############################################################################

sub send_mail {


my $datum=&akt_datum() ;
my $fn ;
my $fnbez ;


if ($MAILHEADER{'email'}) {
	open (DAT , ">> Http://www.der-die-das.com/cgi-bin/webmail/data/emails.dat") ;
	flock(DAT,2) if ($lock==1) ;
	print DAT "$MAILHEADER{'email'}\n" ;
	close (DAT) ;
}


if($offline==1) {
	open(MAIL,"> Http://www.der-die-das.com/cgi-bin/webmail/data/mail.txt") ;
} else {
	&FehlerSeitenAnzeige ("Die Pipe zum sendmail konnte nicht ge&ouml;ffnet werden.") if (!open(MAIL,"|$mailprog -t")) ;
}


print MAIL "To: $MAILHEADER{'recipient'}\n";
print MAIL "From: $MAILHEADER{'email'} ($MAILHEADER{'realname'})\n";


if ($MAILHEADER{'subject'}) {
	print MAIL "Subject: $MAILHEADER{'subject'}\n\n";
} else {
	print MAIL "$stdsub\n\n";
}


print MAIL "---------------------------------------------------------------------------\n";
print MAIL "Mail von $MAILHEADER{'realname'} ($MAILHEADER{'email'}) am $datum\n";
print MAIL "---------------------------------------------------------------------------\n\n";


foreach $fn (sort {$a cmp $b} keys %MAILFORM) {

	$fnbez = substr($fn , 2 , length($fn)) ;
    print MAIL "[$fnbez]\n" ;
	print MAIL "$MAILFORM{$fn}\n\n" ;  

}


print MAIL "\n---------------------------------------------------------------------------\n";
  
close (MAIL) ;


}



#############################################################################
# SENDMAIL-Fehler ausgeben
#############################################################################

sub FehlerSeitenAnzeige {


my $fehler=shift ;


print <<"EOM";

<HEAD>
<TITLE>Es ist ein Fehler aufgetreten</TITLE>
</HEAD>

<BODY>

<H2>Es ist folgender Fehler aufgetreten:</H2>

<em>$fehler</em><p>

<HR>

<em>Bitte benachrichtigen Sie 

<a href="mailto:$MAILHEADER{'recipient'}">$MAILHEADER{'recipient'}</a>.

Vielen Dank f&uuml;r Ihr Verst&auml;ndnis.

</em>

<p>

</BODY></HTML>

EOM


exit 1;


}



#############################################################################
# Aktuelles Datum und Uhrzeit zur¸ckgeben
#############################################################################

sub akt_datum {


my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time+(3600*$zeitverH));


$mon++ ;
$hour = "0$hour"  if ($hour < 10) ; 
$min  = "0$min"   if ($min  < 10) ; 
$sec  = "0$sec"   if ($sec  < 10) ;
$mday = "0$mday"  if ($mday < 10) ;
$mon  = "0$mon"   if ($mon  < 10) ; 


$year+=1900 ;
my $datum = "$mday.$mon.$year um $hour\:$min\:$sec";


return($datum) ;


}



#############################################################################
# ENDE
#############################################################################
