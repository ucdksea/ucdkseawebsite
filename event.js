var currentSlideIndex = 0;
var slides = [];
var slideTexts = [];

function initializeGallery() {
  var eventItems = document.querySelectorAll(".event-item");
  eventItems.forEach(function (item) {
    var img = item.querySelector("img");
    slides.push(img.src);
    slideTexts.push(img.getAttribute("data-text"));
  });
}

// 포스터 이미지
function replacePlaceholders(text) {
  const replacements = {
    '<img-placeholder_요맘때/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2024_spring/yomam/yomamposter.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_resume_2024spring/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2024_spring/resume/resumeworkshopposter_2024.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_dodream_1/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2024_spring/dodream/dodreamposter_1.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_ksea4cuts_2024sping/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2024_spring/ksea4cut/ksea4cutspicnicdayposter_2024.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_studymarathon_winter2024/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2024_winter/studymarathon/studymarathonwinterposter_2024.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_왔다감2024winter/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2024_winter/washere/washereposter.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_ksea4cuts_2023winter/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2024_winter/ksea4cut/ksea4cutswinterposer_2024.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_얼죽삼_2024/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2024_winter/samgyeopsal/samgyeopsalposter.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_studymarathon_2023/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2023_fall/studymarathon/studymarathon2023fall.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_멘토멘티_2023/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2023_fall/mentor/mentormenteeposter_2023.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_개강총회_2023/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2023_fall/gaegang/gaegang_poster.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_gradschool_2023/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2023_spring/graduatementor/gradschoolmentormentreeposter_2023.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>',
    '<img-placeholder_뇌지컬/>': '<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><img src="images/event/2023_winter/brain/brainposter.png" alt="Additional Image" style="width: 100%; height: auto;" /></span>'
  };

  for (const placeholder in replacements) {
    text = text.replace(placeholder, replacements[placeholder]);
  }
  return text;
}

function expandImage(element) {
  var popup = document.getElementById("imagePopup");
  var popupImage = document.getElementById("popupImage");
  var popupText = document.getElementById("popupText");

  var img = element.querySelector("img");
  var imageUrl = img.src;
  var text = img.getAttribute("data-text");

  text = replacePlaceholders(text);

  var lines = text.split("$");

  var formattedText = "";
  lines.forEach(function(line, index) {
    if (index === 0) {
      formattedText += "<p style='font-weight: bold; font-size: 27px;'>" + line + "</p>";
    } else {
      formattedText += "<p style='font-size: 13px;'>" + line + "</p>";
    }
  });

  popup.style.display = "flex";
  popupImage.src = imageUrl;
  popupText.innerHTML = formattedText;

  currentSlideIndex = slides.indexOf(imageUrl);
}

// 슬라이드
function changeSlide(direction) {
  currentSlideIndex += direction;

  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1;
  }

  // 팝업 이미지 텍스트 업데이트
  var popupImage = document.getElementById("popupImage");
  var popupText = document.getElementById("popupText");
  popupImage.src = slides[currentSlideIndex];

  // '$' 으로 텍스트 나눔
  var text = slideTexts[currentSlideIndex];
  text = replacePlaceholders(text);
  var lines = text.split("$");

  // 팝업텍스트 폰트 
  var formattedText = "";
  lines.forEach(function(line, index) {
    if (index === 0) {
      formattedText += "<p style='font-weight: bold; font-size: 27px;'>" + line + "</p>";
    } else {
      formattedText += "<p style='font-size: 13px;'>" + line + "</p>";
    }
  });
  popupText.innerHTML = formattedText;
}

// 팝업 닫기
function closeImage() {
  var popup = document.getElementById("imagePopup");
  popup.style.display = "none";
}

// Initialize gallery 
document.addEventListener("DOMContentLoaded", function () {
  initializeGallery();
});
