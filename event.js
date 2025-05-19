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
function createImagePlaceholder(src, alt) {
  return `<br><span style="display: inline-block; width: auto; height: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">
              <img src="${src}" alt="${alt}" style="width: 100%; height: auto;" />
          </span>`;
}
// 포스터 이미지

function replacePlaceholders(text) {
  const replacements = {
    '<img-placeholder_요맘때_2/>': createImagePlaceholder(
      "images/event/2025_spring/요맘때_poster.PNG",
      "요맘때 2025 Spring"
      ),
    '<img-placeholder_alex/>': createImagePlaceholder(
      "images/event/2025_spring/insta_poster.png",
      "Industry Talk 2025 Spring_2"
      ),
    '<img-placeholder_jihyeong/>': createImagePlaceholder(
      "images/event/2025_spring/samsung.png",
      "Industry Talk 2025 Spring"
      ),
    '<img-placeholder_2ndpicnicday/>': createImagePlaceholder(
      "images/event/2025_spring/kseafourcuts.png",
      "kseafourcuts 2025 Spring"
      ),
    '<img-placeholder_studymarathon_2025_winter/>': createImagePlaceholder(
      "images/event/2025_winter/studymarathon.PNG",
      "studymarathon 2025 Winter"
      ),

    '<img-placeholder_1stgm/>': createImagePlaceholder(
      "images/event/2025_winter/GM 모집 _2.png",
      "1st GM 2025 Winter"
      ),

    '<img-placeholder_OPT_2025/>': createImagePlaceholder(
      "images/event/2025_winter/opt_2025.png",
      "OPT 2025 Winter"
      ),
      
    '<img-placeholder_발렌타인_2025/>': createImagePlaceholder(
      "images/event/2025_winter/발렌타인_펀드레이징.png",
      "발렌타인 2025 Winter"
      ),

    '<img-placeholder_얼죽삼_2025/>': createImagePlaceholder(
      "images/event/2025_winter/얼죽삼.jpeg",
      "얼죽삼 2025 Winter"

    ),'<img-placeholder_studymarathon_fall2024/>': createImagePlaceholder(
      "images/event/2024_fall/studymarathon/studymarathon_poster.png",
      "Study Marathon 2024 Fall"

    ),'<img-placeholder_resume_2024fall/>': createImagePlaceholder(
      "images/event/2024_fall/resume/resume_poster.png",
      "Resume Workshop 2024 Fall"
    ),
    '<img-placeholder_dodream_2/>': createImagePlaceholder(
      "images/event/2024_fall/job/job_poster.PNG",
      "Dodream Job Poster"
    ),
    '<img-placeholder_왔다감_2024fall/>': createImagePlaceholder(
      "images/event/2024_fall/came/왔다감_poster.png",
      "왔다감 Poster"
    ),
    '<img-placeholder_멘토멘티_2024/>': createImagePlaceholder(
      "images/event/2024_fall/mentormentee/mentormenteeposter.png",
      "Mentor Mentee Poster"
    ),
    '<img-placeholder_개강총회_2024/>': createImagePlaceholder(
      "images/event/2024_fall/gaegang/gaegangposter.png",
      "Gaegang Poster"
    ),
    '<img-placeholder_coffeechat/>': createImagePlaceholder(
      "images/event/2024_fall/coffeechat/coffeechatposter.png",
      "Coffee Chat Poster"
    ),
    '<img-placeholder_요맘때/>': createImagePlaceholder(
      "images/event/2024_spring/yomam/yomamposter.png",
      "Yomam Poster"
    ),
    '<img-placeholder_resume_2024spring/>': createImagePlaceholder(
      "images/event/2024_spring/resume/resumeworkshopposter_2024.png",
      "Resume Workshop 2024 Spring"
    ),
    '<img-placeholder_dodream_1/>': createImagePlaceholder(
      "images/event/2024_spring/dodream/dodreamposter_1.png",
      "Dodream Poster 1"
    ),
    '<img-placeholder_ksea4cuts_2024sping/>': createImagePlaceholder(
      "images/event/2024_spring/ksea4cut/ksea4cutspicnicdayposter_2024.png",
      "KSEA 4 Cuts Picnic Day 2024"
    ),
    '<img-placeholder_studymarathon_winter2024/>': createImagePlaceholder(
      "images/event/2024_winter/studymarathon/studymarathonwinterposter_2024.png",
      "Study Marathon Winter 2024"
    ),
    '<img-placeholder_왔다감2024winter/>': createImagePlaceholder(
      "images/event/2024_winter/washere/washereposter.png",
      "왔다감 Winter 2024"
    ),
    '<img-placeholder_ksea4cuts_2023winter/>': createImagePlaceholder(
      "images/event/2024_winter/ksea4cut/ksea4cutswinterposer_2024.png",
      "KSEA 4 Cuts Winter 2023"
    ),
    '<img-placeholder_얼죽삼_2024/>': createImagePlaceholder(
      "images/event/2024_winter/samgyeopsal/samgyeopsalposter.png",
      "얼죽삼 2024"
    ),
    '<img-placeholder_studymarathon_2023/>': createImagePlaceholder(
      "images/event/2023_fall/studymarathon/studymarathon2023fall.png",
      "Study Marathon Fall 2023"
    ),
    '<img-placeholder_멘토멘티_2023/>': createImagePlaceholder(
      "images/event/2023_fall/mentor/mentormenteeposter_2023.png",
      "Mentor Mentee 2023"
    ),
    '<img-placeholder_개강총회_2023/>': createImagePlaceholder(
      "images/event/2023_fall/gaegang/gaegang_poster.png",
      "Gaegang Poster 2023"
    ),
    '<img-placeholder_gradschool_2023/>': createImagePlaceholder(
      "images/event/2023_spring/graduatementor/gradschoolmentormentreeposter_2023.png",
      "Graduate School Mentor Program 2023"
    ),
    '<img-placeholder_뇌지컬/>': createImagePlaceholder(
      "images/event/2023_winter/brain/brainposter.png",
      "Brainstorming Event 2023"
    )
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
