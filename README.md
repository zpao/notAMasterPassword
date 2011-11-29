Because I think [bug 665370](https://bugzilla.mozilla.org/show_bug.cgi?id=665370) should remain _WONTFIX_.

Set `extensions.notAMasterPassword.password` to whatever password you want.

- - -

TODO:

* only protect the window if there isn't a master password set
* make it suck less (one of these)
  * let the window appear before prompting
  * prompt from the prefs window _before_ the password window is open
  * prompt on when "show passwords" is clicked
* localize it
