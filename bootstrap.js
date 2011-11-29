const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

const PREFNAME = "extensions.notAMasterPassword.password";
const DEBUG = false;

const DIALOG_TITLE = "Not A Master Password";
const DIALOG_TEXT = "Please enter your password to show your saved passwords.";

Cu.import("resource://gre/modules/Services.jsm");

function log(aMsg) {
  if (!DEBUG) return;
  aMsg = ("notAMasterPassword: " + aMsg + "\n");
  dump(aMsg);
  Services.console.logStringMessage(aMsg);
}

function install(data, reason) {
  log("install... " + Services.prefs.prefHasUserValue(PREFNAME));
  // set default pref values
  if (!Services.prefs.prefHasUserValue(PREFNAME))
    Services.prefs.setCharPref(PREFNAME, generateDefaultPassword());
}

function startup(data, reason) {
  // register our observer
  Services.ww.registerNotification(observe);
}

function shutdown(data, reason) {
  // unregister our observer
  Services.ww.unregisterNotification(observe);
}

function uninstall(data, reason) {
  try {
    log("clearing the pref");
    Services.prefs.clearUserPref(PREFNAME);
  }
  catch (e) { }
}

function observe(aSubject, aTopic, aData) {
  switch (aTopic) {
    case "domwindowopened":
      // wait for the load event so we can attach the prompt. the window still won't really be drawn but meh
      aSubject.addEventListener("load", function onWindowLoad(aEvent) {
        let window = aEvent.currentTarget;
        window.removeEventListener("load", onWindowLoad, false);
        if (window.document.documentElement.getAttribute("windowtype") != "Toolkit:PasswordManager")
          return;

        let realpw = Services.prefs.getCharPref(PREFNAME);
        promptForPassword(window, realpw);
      }, false);
      break;
  }
}

function promptForPassword(aWindow, aRealPW) {
  let pw = {};
  let ok = Services.prompt.promptPassword(aWindow, DIALOG_TITLE, DIALOG_TEXT, pw, null, {});
  log(ok);
  log(pw.value);
  // try try again until cancel
  if (!ok)
    aWindow.close();
  else if (pw.value != aRealPW)
    promptForPassword(aWindow, aRealPW);
}

function generateDefaultPassword() {
  return Cc["@mozilla.org/uuid-generator;1"].getService(Ci.nsIUUIDGenerator).generateUUID().toString();
}

