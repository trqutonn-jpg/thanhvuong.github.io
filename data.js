const APP_DATA = {
  currentUser: {
    name: "Nguyen Minh Anh",
    email: "minhanh@example.com",
    birthday: "2005-09-12",
    role: "hocsinh"
  },
  defaultImages: [
    {
      label: "Giáo dục",
      src: "image/giaoduc.jpg"
    },
    {
      label: "Giao thông",
      src: "image/giaothong.jpg"
    },
    {
      label: "Thời tiết",
      src: "image/thoitiet.jpg"
    },
    {
      label: "Công nghệ",
      src: "image/congnghe.jpg"
    },
    {
      label: "Âm nhạc",
      src: "uploads/1765296929_amnhac.jpg"
    },
    {
      label: "Động vật",
      src: "uploads/1766570678_animals.jpg"
    },
    {
      label: "Gia đình",
      src: "uploads/1766600505_family.jpg"
    },
    {
      label: "Trường học",
      src: "uploads/1766709160_school.PNG"
    },
    {
      label: "Thành phố",
      src: "uploads/1766718553_city.PNG"
    }
  ],
  topics: [
    {
      id: 1,
      name: "Giáo dục",
      image: "image/giaoduc.jpg",
      featured: true
    },
    {
      id: 2,
      name: "Giao thông",
      image: "image/giaothong.jpg",
      featured: true
    },
    {
      id: 3,
      name: "Thời tiết",
      image: "image/thoitiet.jpg",
      featured: true
    },
    {
      id: 4,
      name: "Công nghệ",
      image: "image/congnghe.jpg",
      featured: true
    },
    {
      id: 5,
      name: "Gia đình",
      image: "uploads/1766709251_fami.PNG",
      featured: false
    },
    {
      id: 6,
      name: "Thành phố",
      image: "uploads/1766718553_city.PNG",
      featured: false
    }
  ],
  words: [
    {
      id: 1,
      topicId: 1,
      word: "school",
      type: "noun",
      meaning: "trường học",
      pronunciation: "/skuːl/",
      example: "My school is near my house."
    },
    {
      id: 2,
      topicId: 1,
      word: "teacher",
      type: "noun",
      meaning: "giáo viên",
      pronunciation: "/ˈtiːtʃər/",
      example: "The teacher explains the lesson clearly."
    },
    {
      id: 3,
      topicId: 1,
      word: "student",
      type: "noun",
      meaning: "học sinh",
      pronunciation: "/ˈstuːdnt/",
      example: "Every student has a notebook."
    },
    {
      id: 4,
      topicId: 1,
      word: "library",
      type: "noun",
      meaning: "thư viện",
      pronunciation: "/ˈlaɪbreri/",
      example: "We read books in the library."
    },
    {
      id: 5,
      topicId: 1,
      word: "lesson",
      type: "noun",
      meaning: "bài học",
      pronunciation: "/ˈlesn/",
      example: "Today we have an English lesson."
    },
    {
      id: 6,
      topicId: 1,
      word: "homework",
      type: "noun",
      meaning: "bài tập về nhà",
      pronunciation: "/ˈhoʊmwɜːrk/",
      example: "I finish my homework after dinner."
    },
    {
      id: 7,
      topicId: 1,
      word: "exam",
      type: "noun",
      meaning: "kỳ thi",
      pronunciation: "/ɪɡˈzæm/",
      example: "The exam starts at eight o'clock."
    },
    {
      id: 8,
      topicId: 1,
      word: "subject",
      type: "noun",
      meaning: "môn học",
      pronunciation: "/ˈsʌbdʒekt/",
      example: "Math is my favorite subject."
    },
    {
      id: 9,
      topicId: 1,
      word: "classroom",
      type: "noun",
      meaning: "lớp học",
      pronunciation: "/ˈklæsruːm/",
      example: "The classroom is bright and clean."
    },
    {
      id: 10,
      topicId: 1,
      word: "grade",
      type: "noun",
      meaning: "điểm số",
      pronunciation: "/ɡreɪd/",
      example: "She got a good grade in English."
    },
    {
      id: 11,
      topicId: 2,
      word: "traffic light",
      type: "noun",
      meaning: "đèn giao thông",
      pronunciation: "/ˈtræfɪk laɪt/",
      example: "Stop when the traffic light is red."
    },
    {
      id: 12,
      topicId: 2,
      word: "bus",
      type: "noun",
      meaning: "xe buýt",
      pronunciation: "/bʌs/",
      example: "I go to school by bus."
    },
    {
      id: 13,
      topicId: 2,
      word: "helmet",
      type: "noun",
      meaning: "mũ bảo hiểm",
      pronunciation: "/ˈhelmɪt/",
      example: "Wear a helmet when riding a bike."
    },
    {
      id: 14,
      topicId: 3,
      word: "sunny",
      type: "adjective",
      meaning: "có nắng",
      pronunciation: "/ˈsʌni/",
      example: "It is sunny today."
    },
    {
      id: 15,
      topicId: 3,
      word: "rainy",
      type: "adjective",
      meaning: "có mưa",
      pronunciation: "/ˈreɪni/",
      example: "The rainy season starts in May."
    },
    {
      id: 16,
      topicId: 3,
      word: "cloud",
      type: "noun",
      meaning: "đám mây",
      pronunciation: "/klaʊd/",
      example: "A dark cloud covers the sky."
    },
    {
      id: 17,
      topicId: 4,
      word: "computer",
      type: "noun",
      meaning: "máy tính",
      pronunciation: "/kəmˈpjuːtər/",
      example: "I use a computer to study online."
    },
    {
      id: 18,
      topicId: 4,
      word: "keyboard",
      type: "noun",
      meaning: "bàn phím",
      pronunciation: "/ˈkiːbɔːrd/",
      example: "This keyboard is very comfortable."
    },
    {
      id: 19,
      topicId: 5,
      word: "mother",
      type: "noun",
      meaning: "mẹ",
      pronunciation: "/ˈmʌðər/",
      example: "My mother cooks dinner."
    },
    {
      id: 20,
      topicId: 5,
      word: "brother",
      type: "noun",
      meaning: "anh/em trai",
      pronunciation: "/ˈbrʌðər/",
      example: "My brother plays football."
    },
    {
      id: 21,
      topicId: 6,
      word: "building",
      type: "noun",
      meaning: "tòa nhà",
      pronunciation: "/ˈbɪldɪŋ/",
      example: "There is a tall building downtown."
    },
    {
      id: 22,
      topicId: 6,
      word: "street",
      type: "noun",
      meaning: "đường phố",
      pronunciation: "/striːt/",
      example: "The street is crowded at night."
    }
  ]
};
