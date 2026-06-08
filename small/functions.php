<?
/*
Small Chat 0.2 - (14. September 04)
Michael Salzer
http://spring.realone.ch
It's free to use, but don't delete these lines.
Special thanks to Mathias G. for :)-Script & to Tobi H. for JavaScripts
*/

function smileize ($text) {
    global $smilie_dir;

    $text = str_replace("*gg*", "<img src=\"./".$smilie_dir."bigsmile.gif\">", $text);
    $text = str_replace(":-))", "<img src=\"./".$smilie_dir."bigsmile.gif\">", $text);
    $text = str_replace(":))", "<img src=\"./".$smilie_dir."bigsmile.gif\">", $text);
    $text = str_replace(":o))", "<img src=\"./".$smilie_dir."bigsmile.gif\">", $text);

    $text = str_replace(":)", "<img src=\"./".$smilie_dir."smile.gif\">", $text);
    $text = str_replace(":-)", "<img src=\"./".$smilie_dir."smile.gif\">", $text);
    $text = str_replace(":o)", "<img src=\"./".$smilie_dir."smile.gif\">", $text);

    $text = str_replace("*ggg*", "<img src=\"./".$smilie_dir."gigagrossessmile.gif\">", $text);
    $text = str_replace(":D", "<img src=\"./".$smilie_dir."gigagrossessmile.gif\">", $text);
    $text = str_replace(":-D", "<img src=\"./".$smilie_dir."gigagrossessmile.gif\">", $text);

    $text = str_replace(";)", "<img src=\"./".$smilie_dir."wink.gif\">", $text);
    $text = str_replace(";o)", "<img src=\"./".$smilie_dir."wink.gif\">", $text);
    $text = str_replace(";-)", "<img src=\"./".$smilie_dir."wink.gif\">", $text);

    $text = str_replace(";-b", "<img src=\"./".$smilie_dir."wink2.gif\">", $text);

    $text = str_replace(":(", "<img src=\"./".$smilie_dir."frown.gif\">", $text);
    $text = str_replace(":-(", "<img src=\"./".$smilie_dir."frown.gif\">", $text);
    $text = str_replace(":o(", "<img src=\"./".$smilie_dir."frown.gif\">", $text);

    $text = str_replace(":'o(", "<img src=\"./".$smilie_dir."cry.gif\">", $text);
    $text = str_replace(":'(", "<img src=\"./".$smilie_dir."cry.gif\">", $text);
    $text = str_replace(":'-(", "<img src=\"./".$smilie_dir."cry.gif\">", $text);
    $text = str_replace(":-C", "<img src=\"./".$smilie_dir."cry.gif\">", $text);

    $text = str_replace(":oS", "<img src=\"./".$smilie_dir."confused.gif\">", $text);
    $text = str_replace(":S", "<img src=\"./".$smilie_dir."confused.gif\">", $text);
    $text = str_replace(":-S", "<img src=\"./".$smilie_dir."confused.gif\">", $text);

    $text = str_replace("*eek*", "<img src=\"./".$smilie_dir."eek.gif\">", $text);

    $text = str_replace("8-)", "<img src=\"./".$smilie_dir."cool.gif\">", $text);
    $text = str_replace("8o)", "<img src=\"./".$smilie_dir."cool.gif\">", $text);
    $text = str_replace("8)", "<img src=\"./".$smilie_dir."cool.gif\">", $text);

    $text = str_replace("8-D", "<img src=\"./".$smilie_dir."smile_cool.gif\">", $text);
    $text = str_replace("8D", "<img src=\"./".$smilie_dir."smile_cool.gif\">", $text);
    $text = str_replace("8oD", "<img src=\"./".$smilie_dir."smile_cool.gif\">", $text);

    $text = str_replace(":-P", "<img src=\"./".$smilie_dir."zunge.gif\">", $text);
    $text = str_replace(":P", "<img src=\"./".$smilie_dir."zunge.gif\">", $text);
    $text = str_replace(":oP", "<img src=\"./".$smilie_dir."zunge.gif\">", $text);

    $text = str_replace(":-B", "<img src=\"./".$smilie_dir."face82.gif\">", $text);
    $text = str_replace(":B", "<img src=\"./".$smilie_dir."face82.gif\">", $text);
    $text = str_replace(":oB", "<img src=\"./".$smilie_dir."face82.gif\">", $text);

    $text = str_replace("*hmm*", "<img src=\"./".$smilie_dir."grummel.gif\">", $text);
    $text = str_replace("*hm*", "<img src=\"./".$smilie_dir."grummel.gif\">", $text);

    $text = str_replace("*yeah*", "<img src=\"./".$smilie_dir."nsmilie.gif\">", $text);
    $text = str_replace("*juhu*", "<img src=\"./".$smilie_dir."nsmilie.gif\">", $text);

    $text = str_replace("*ha*", "<img src=\"./".$smilie_dir."pleased.gif\">", $text);
    $text = str_replace("*lach*", "<img src=\"./".$smilie_dir."pleased.gif\">", $text);

    $text = str_replace("*peinlich*", "<img src=\"./".$smilie_dir."redface.gif\">", $text);
    $text = str_replace("*redface*", "<img src=\"./".$smilie_dir."redface.gif\">", $text);

    $text = str_replace("*gucken*", "<img src=\"./".$smilie_dir."rolleyes.gif\">", $text);

    $text = str_replace("*lol*", "<img src=\"./".$smilie_dir."lol.gif\">", $text);

    $text = str_replace("*mad*", "<img src=\"./".$smilie_dir."mad.gif\">", $text);

    $text = str_replace("*fg*", "<img src=\"./".$smilie_dir."fg.gif\">", $text);
    $text = str_replace("*g*", "<img src=\"./".$smilie_dir."smile.gif\">", $text);
    return $text;
}

function urlize ($text) {
    return preg_replace("/((http(s?):\/\/)|(www\.))([^\s|^<]*)/i", "<a href=\"http$3://$4$5\" target=\"_blank\">$2$4$5</a>", $text);
}
?>
