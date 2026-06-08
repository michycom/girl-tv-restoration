function change(form) {
    var curr_kat_pic=form.kategorien.selectedIndex
    window.open(form.kategorien.options[curr_kat_pic].value, target="browse");
}