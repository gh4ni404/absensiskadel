function doGet(e) {
  var params = e.parameter;
  var action = params.action;

  if (!action) return ContentService.createTextOutput("Missing action parameter");

  switch (action) {
    case "login":
      return handleLogin(params.username, params.password);
    case "getUserMenu":
      return getUserMenu(params.username);
    case "getCards":
      return getCards();
    case "getDashboardData":
      return getDashboardData(params.username);
    default:
      return ContentService.createTextOutput("Invalid action");
  }
}

function getSheetData(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return sheet ? sheet.getDataRange().getValues() : null;
}

function handleLogin(username, password) {
  var users = getSheetData("users");
  if (!users) return ContentService.createTextOutput("Error: User sheet not found");

  var user = users.find(row => row[1] === username && row[2] === password);
  return ContentService.createTextOutput(user ? JSON.stringify({ success: true, role: user[3] }) : JSON.stringify({ success: false }));
}

function getUserMenu(username) {
  var users = getSheetData("users");
  var menus = getSheetData("menus");
  if (!users || !menus) return ContentService.createTextOutput("Error: Data not found");

  var user = users.find(row => row[1] === username);
  if (!user) return ContentService.createTextOutput(JSON.stringify({ success: false }));

  var userRole = user[3];
  var userMenus = menus.filter(row => row[1] === userRole).map(row => ({ title: row[2], description: row[3] }));

  return ContentService.createTextOutput(JSON.stringify(userMenus));
}

function getCards() {
  var cards = getSheetData("cards");
  if (!cards) return ContentService.createTextOutput("Error: Cards sheet not found");

  var formattedCards = cards.map(row => ({ title: row[0], description: row[1] }));
  return ContentService.createTextOutput(JSON.stringify(formattedCards));
}

function getDashboardData(username) {
  var users = getSheetData("users");
  var dashboard = getSheetData("dashboard");
  if (!users || !dashboard) return ContentService.createTextOutput("Error: Data not found");

  var user = users.find(row => row[1] === username);
  if (!user) return ContentService.createTextOutput(JSON.stringify({ success: false }));

  var userRole = user[3];
  var userData = dashboard.find(row => row[0] === userRole);

  return ContentService.createTextOutput(JSON.stringify(userData ? { success: true, data: userData.slice(1) } : { success: false }));
}
