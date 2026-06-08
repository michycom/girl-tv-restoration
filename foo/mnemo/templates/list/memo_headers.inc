<?php $sortdirclass = $sortdir ? 'sortup' : 'sortdown' ?>

<script type="text/javascript">
<!--

var PREFS_UPDATE_TIMEOUT;

function table_sortCallback(tableId, column, sortDown)
{
    if (typeof PREFS_UPDATE_TIMEOUT != "undefined") {
        window.clearTimeout(PREFS_UPDATE_TIMEOUT);
    }

    PREFS_UPDATE_TIMEOUT = window.setTimeout('doPrefsUpdate("' + column + '", "' + sortDown + '")', 300);
}

function doPrefsUpdate(column, sortDown)
{
    // Abort if there is no httpclient support.
    if (typeof(HTTPClient) != 'function') {
        return;
    }

    baseurl = '<?php echo Horde::url($registry->get('webroot', 'horde') . '/rpc.php?restCall=horde/setPreference', true) ?>';
    try {
        client = new HTTPClient();
        client.init(baseurl + '&pref=sortby&app=mnemo&value=' + encodeURIComponent(column.substring(1)));
        client.asyncGET();

        client = new HTTPClient();
        client.init(baseurl + '&pref=sortdir&app=mnemo&value=' + encodeURIComponent(sortDown));
        client.asyncGET();
    } catch (e) {}
}

// -->
</script>

<table width="100%" id="memos" cellspacing="0" class="sortable linedRow nowrap">
<thead>
 <tr class="item">
  <th class="leftAlign nosort" width="3%"><?php echo Horde::img('edit.png', _("Edit Note"), '', $registry->getImageDir('horde')) ?></th>
  <th id="s<?php echo MNEMO_SORT_DESC ?>" class="leftAlign<?php echo ($sortby == MNEMO_SORT_DESC) ? ' ' . $sortdirclass : '' ?>" width="82%">
    <?php echo Horde::widget(Horde::applicationUrl(Util::addParameter('list.php', 'sortby', MNEMO_SORT_DESC)), _("Sort by Note Text"), 'sortlink', '', '', _("No_te")) ?>
  </th>
  <th id="s<?php echo MNEMO_SORT_CATEGORY ?>" class="leftAlign<?php echo ($sortby == MNEMO_SORT_CATEGORY) ? ' ' . $sortdirclass : '' ?>" width="15%">
    <?php
    echo Horde::widget(Horde::applicationUrl(Util::addParameter('list.php', 'sortby', MNEMO_SORT_CATEGORY)), _("Sort by Category"), 'sortlink', '', '', _("_Category"));
    if (Auth::getAuth() && (!$GLOBALS['prefs']->isLocked('categories') ||
                            !$GLOBALS['prefs']->isLocked('category_colors'))) {
        $categoryUrl = Util::addParameter(Horde::url($GLOBALS['registry']->get('webroot', 'horde') . '/services/prefs.php'), array('app' => 'horde', 'group' => 'categories'));
        echo ' ' . Horde::link($categoryUrl, _("Edit categories and colors"), '', '_blank', 'popup(this.href); return false;') . Horde::img('colorpicker.png', _("Edit categories and colors"), '', $GLOBALS['registry']->getImageDir('horde')) . '</a>';
    }
    ?>
  </th>
 </tr>
</thead>
<tbody>
