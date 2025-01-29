function login(event) {
  event.preventDefault();

  var username=document.getElementById("username").value;
  var password=document.getElementById("password").value;

  fetch("https://script.google.com/macros/s/AKfycbxsQxYgl6fZjlw3EdOqPZHqKS8gT0NQQnpLPhmHd8uUwr2CPRz9AqNp7q0EIZ99zedJ/exec", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(data => {
    if(data.status==="success"){
      alert("Login berhasil! Role: "+ data.role);
      window.location.href = "/pages/"+data.role+"/index.html";
    } else {
      alert("Login Gagal: "+data.message);
    }
  })
  .catch(error=> console.error("Error:", error));
}