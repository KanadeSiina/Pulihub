"use strict";

var GetUrlValue = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substring(1).match(reg);
  if (r != null) {
    try {
      return decodeURIComponent(r[2]);
    } catch (e) {
      return null;
    }
  }
  return null;
};

function matchlink(text, reg, urlbase) {
  var allmatch = text.match(reg);
  if (allmatch) {
    for (var j = 0; j < allmatch.length; j++) {
      text = text.replace(
        allmatch[j],
        '<a class="reproduce" target="_blank" href="' +
          urlbase +
          allmatch[j] +
          '">' +
          allmatch[j] +
          "</a>"
      );
    }
  }
  return text;
}

function autolink(text) {
  text = matchlink(
    text,
    new RegExp("av\\d+", "ig"),
    "https://www.bilibili.com/video/"
  );
  text = matchlink(
    text,
    new RegExp("sm\\d+", "ig"),
    "https://www.nicovideo.jp/watch/"
  );
  text = matchlink(
    text,
    new RegExp("v=\\S+", "ig"),
    "https://www.youtube.com/watch?"
  );
  return text;
}

function raise() {
  $("#tips").modal("show");
  setTimeout(function () {
    window.location.reload();
  }, 3000);
}

function showList(vcode) {
  $.ajax({
    type: "GET",
    url: "api/data",
    success: function (data, status) {
      console.log(data);
      if (data[vcode] == undefined) {
        for (var key in data) {
          if (data[key]["is_public"] == true) {
            $("#vlist").append(
              '<div class="col mb-4"><div class="card h-100"><a href="?vcode=' +
                key +
                '"><img src="' +
                data[key]["poster"] +
                '" class="card-img-top" /><div class="card-body"><h5 class="card-title">' +
                data[key]["title"] +
                '</h5><p class="card-text">' +
                data[key]["desc"] +
                "</p></div></a></div></div>"
            );
          }
        }
      } else {
        showPlayer(data, vcode);
      }
    },
    error: function (xhr) {
      console.log(xhr.status + xhr.statusText);
      raise();
    },
  });
}

function showPlayer(jsondata, vcode) {
  console.log("showing", jsondata[vcode]);
  if (jsondata[vcode]["type"] == "bhpan") {
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "https://bhpan.buaa.edu.cn/api/v1/link?method=osdownload",
      data: JSON.stringify(jsondata[vcode]["postdata"]),
      success: function (data, status) {
        var link = data.authrequest[1];
        $("#player").show();
        $("#vinfo").show();
        $("#dl-btn").show();
        $("#dl-btn").attr("href", link);
        $("#vcontent").attr("src", link);
        $("#player").attr("data-poster", jsondata[vcode]["poster"]);
        $("#vtitle").text(jsondata[vcode]["title"]);
        $("#vdesc").html(autolink(jsondata[vcode]["desc"]));
        var player = new Plyr("#player");
      },
      error: function (xhr) {
        console.log(xhr.status + xhr.statusText);
        raise();
      },
    });
  } else {
    // direct file
    var link = jsondata[vcode]["link"];
    $("#player").show();
    $("#vinfo").show();
    $("#dl-btn").show();
    $("#dl-btn").attr("href", link);
    $("#vcontent").attr("src", link);
    $("#player").attr("data-poster", jsondata[vcode]["poster"]);
    $("#vtitle").text(jsondata[vcode]["title"]);
    $("#vdesc").html(autolink(jsondata[vcode]["desc"]));
    var player = new Plyr("#player");
  }
}

$(document).ready(function () {
  var vcode = GetUrlValue("vcode");
  showList(vcode);
});