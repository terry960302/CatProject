/* Short-haired cat */
function shortHairCoat(coat) {
  document.getElementById("coat").innerHTML =
    "<img src = data/short/coat/" + coat + ".png>";
}

function shortHairEye(eye) {
  document.getElementById("eye").innerHTML =
    "<img src = data/short/eye/" + eye + ".png>";
}

function shortHairNose(nose) {
  document.getElementById("nose").innerHTML =
    "<img src = data/short/nose/" + nose + ".png>";
}

/* Long-haired cat */
function longHairCoat(coat) {
  document.getElementById("coat").innerHTML =
    "<img src = data/long/coat/" + coat + ".png>";
}

function longHairEye(eye) {
  document.getElementById("eye").innerHTML =
    "<img src = data/long/eye/" + eye + ".png>";
}

function longHairNose(nose) {
  document.getElementById("nose").innerHTML =
    "<img src = data/long/nose/" + nose + ".png>";
}

/* DOWNLOAD */
// $(function () {
//   $("#save").on("click", async function () {
//     // 캡쳐 라이브러리를 통해서 canvas 오브젝트를 받고 이미지 파일로 리턴한다.
//     let canvas = await html2canvas(document.querySelector("#capture"), {
//       logging: true,
//       allowTaint: true,
//     });
//     let uri = canvas.toDataURL("image/png"); // data type
//     console.log("이미지 로컬 경로 : ", uri);
//     // saveAs(uri, "capture-test.png"); // 이거 대신에 /upload로 이미지 uri전송
//   });

//   function saveAs(uri, filename) {
//     // 캡쳐된 파일을 이미지 파일로 내보낸다.
//     var link = document.createElement("a");
//     if (typeof link.download === "string") {
//       link.href = uri;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       window.open(uri);
//     }
//   }
// });

/* RESET */
$(function () {
  $("#reset").on("click", function () {
    /* RESET COAT */
    $("input:radio[name='coat']").prop("checked", false);
    $("#coat").html("");
    /* RESET EYE */
    $("input:radio[name='eye']").prop("checked", false);
    $("#eye").html("");
    /* RESET NOSE */
    $("input:radio[name='nose']").prop("checked", false);
    $("#nose").html("");
  });
});

/*
$("#reset").on("click", function() {
    $('input[name = "coat"]').removeAttr('checked');
    $('input[name = "eye"]').removeAttr('checked');
    $('input[name = "nose"]').removeAttr('checked');
});
*/
