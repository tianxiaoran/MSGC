$(function () {
  // 读取用户信息, 显示到页面
  let user = sessionStorage.getItem('user') || localStorage.getItem('user')
  user = JSON.parse(user)

  $('.profile tr:eq(0)>td').eq(1).text(user.nickname || '外星人')
  $('.profile tr:eq(1)>td').eq(1).text(user.phone)

  $('.profile tr:eq(2)>td').eq(1)
    .text(moment(user.created).format('YYYY/MM/DD HH:mm:ss'))


  $('#body>div li').click(function () {
    $(this).addClass('active').siblings().removeClass('active')

    const i = $(this).index()
    // 根据序号, 找到对应的详情
    $('#body>ul>li').eq(i).show().siblings().hide()
  })

  // 初始化, 激活个人信息
  $('#body>div li').eq(0).click()

  // 退出按钮
  $('button#logout').click(function () {
    sessionStorage.removeItem('user')
    localStorage.removeItem('user')

    location.replace('?p=home')
  })

  // 头像
  var url = 'https://serverms.xin88.top/users/head_photos'
  $.get(url, data => {
    console.log(data)

    $('.my-photo>div>ul').html(
      data.hero.map(value => {
        const { alias, selectAudio } = value
        // 利用自定义属性, 在元素上保存一些数据
        return `<li data-sa="${selectAudio}"><img src="https://game.gtimg.cn/images/lol/act/img/champion/${alias}.png" alt=""></li>`
      })
    )
  })

  // 音频元素 Audio
  const audio = new Audio()  // 实例化出音频播放器

  // 异步请求得到的内容 -- 委托
  $('.my-photo').on('click', 'li', function () {
    // 读取点击项的图片的src属性, 赋值给头像图
    // children(): 子元素
    const src = $(this).children().prop('src')
    $('.my-photo>div>img').prop('src', src)

    // 读取自定义属性
    var sa = $(this).data('sa')

    audio.src = sa
    audio.play() // 开始播放
  })

  // 更新头像
  $('.my-photo>div>button').click(function () {
    var url = 'https://serverms.xin88.top/users/head_photo'
    // 头像地址
    var src = $('.my-photo>div>img').prop('src')

    $.post(url, { id: user.id, alias: src }, data => {
      console.log(data)
      if (data.code == 200) {
        alert("更新成功!")
        // 更新头部栏中的头像
        $('#header #login+div>img').prop('src', src)
        // 更新本地存储的用户信息中的头像地址
        user.avatar = src
        // 由于存储方式有两种, 需要判断具体存放到哪里
        if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(user))
        }

        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(user))
        }

      } else {
        alert("更新失败!")
      }
    })
  })
})



