$(function () {

  $('button#login').click(function () {
    var phone = $('#phone').val()
    var pwd = $('#password').val()

    var url = 'https://serverms.xin88.top/users/login'
    $.post(url, { phone, pwd }, data => {
      console.log(data)
      if (data.code == 200) {
        var checked = $('#autologin').prop('checked')
        // 根据 是否自动登录, 存储在不同位置
        if (checked) {
          // 对象类型存储, 要转JSON
          localStorage.setItem('user', JSON.stringify(data.data))
        } else {
          sessionStorage.setItem('user', JSON.stringify(data.data))
        }

        alert('恭喜! 登录成功. 即将回到首页')
        location.replace('?p=home')
      } else {
        alert("登录失败! 请检查用户名和密码")
      }
    })
  })
})