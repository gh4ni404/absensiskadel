document.addEventListener("DOMContentLoaded", function() {
  const loginBtn = document.getElementById("login-button");
  const loginTxt = document.getElementById("login-text");

  const userRole = localStorage.getItem("userRole");

  if(userRole) {
    loginTxt.textContent = "Dashboard";
    loginBtn.href = userRole === "admin" ? "/pages/admin/index.html" : "/pages/guru/index.html";
  } else {
    loginBtn.href = "/authen/login.html";
  }
});