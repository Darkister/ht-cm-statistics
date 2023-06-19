/** create basic layout for the tab Setup
 *
 */
function createSettingsLayout() {
  if (staticSheet == null) {
    ss.insertSheet("Settings", 1);
    staticSheet = ss.getSheetByName("Settings");
  }
}
