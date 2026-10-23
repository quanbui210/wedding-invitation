/* =====================================================================
   WEDDING CONFIG: edit everything here. No layout code changes needed.
   Every value marked  // TODO  is a placeholder for real content.
   Text fields that exist in both languages use { vi: '...', en: '...' }.
   ===================================================================== */
window.WEDDING = {

  defaultLang: 'vi',          // 'vi' or 'en'
  hashtag: '#BaoPhiThuyLinh',

  couple: {
    groom: {
      shortName: 'Bảo Phi',
      fullName: 'Doãn Bảo Phi',
      order: null                          // optional, e.g. { vi: 'Trưởng nam', en: 'Eldest son' }
    },
    bride: {
      shortName: 'Thúy Linh',
      fullName: 'Phạm Thúy Linh',
      order: null                          // optional, e.g. { vi: 'Thứ nữ', en: 'Second daughter' }
    },
    monogram: { left: 'P', right: 'L' }    // letters used in the monogram
  },

  // Shown under the hero date. null hides it.
  quote: {
    vi: 'Chỉ cần là đúng người, muộn một chút cũng không sao. Thật may mắn vì chúng ta đã tìm thấy và trân trọng nhau.',
    en: 'With the right person, a little late is no matter. How lucky we are to have found and cherished each other.'
  },

  // Nhà trai / Nhà gái. address is optional ('' hides it).
  family: {
    groom: {
      father: 'Ông Doãn Tuấn Anh',
      mother: 'Bà Nguyễn Hồng Ngọc',
      address: ''
    },
    bride: {
      father: 'Ông Phạm Thanh Bình',
      mother: 'Bà Vũ Thúy Hạnh',
      address: ''
    }
  },

  /* The reception. `main: true` drives the countdown and the hero date.
     More events can be added as extra objects; the page and RSVP adapt. */
  events: [
    {
      id: 'tiec-cuoi',
      main: true,
      name: { vi: 'Tiệc Cưới', en: 'Wedding Reception' },
      host: { vi: 'Phòng tiệc Platinum · Tầng 4', en: 'Platinum Ballroom · 4th floor' },
      doors: '11:00',                       // TODO confirm: guests welcomed from
      sketch: 'venue',                      // drawing at the top of the card (assets/js/sketches.js)
      start: '2026-12-29T11:30:00+07:00',
      end:   '2026-12-29T14:00:00+07:00',   // TODO end time is a guess
      lunar: { vi: 'Tức ngày 21 tháng 11 năm Bính Ngọ', en: '21st day of the 11th lunar month' },
      lunarShort: '21.11',
      lunarYear: { vi: 'Năm Bính Ngọ', en: 'Year of the Horse' },
      venue: 'Trung tâm Tiệc cưới The One',
      address: 'Số 2 Chương Dương Độ, Phường Hồng Hà, Hà Nội',
      mapUrl: 'https://maps.app.goo.gl/Emy7jYVHBUp1LFVQ7',
      dressCode: null                       // e.g. { vi: 'Trang phục: ...', en: 'Dress code: ...' }
    }
  ],

  /* The reception programme, shown with hand-drawn sketches.
     sketch: 'lanterns' | 'tea' | 'cake' | 'toast' | 'scooter' | 'envelope' (see assets/js/sketches.js)
     [] hides the section. */
  program: [ // TODO confirm times
    { time: '11:00', sketch: 'lanterns', title: { vi: 'Đón khách', en: 'Welcome' }, note: { vi: 'Chụp ảnh cùng cô dâu chú rể', en: 'Photos with the couple' } },
    { time: '11:30', sketch: 'tea',      title: { vi: 'Lễ thành hôn', en: 'The ceremony' }, note: { vi: 'Dâng trà, trao nhẫn', en: 'Tea ceremony and rings' } },
    { time: '12:00', sketch: 'cake',     title: { vi: 'Khai tiệc', en: 'Lunch' }, note: { vi: 'Cắt bánh, dùng bữa', en: 'Cake and lunch' } },
    { time: '12:45', sketch: 'toast',    title: { vi: 'Nâng ly', en: 'Toasts' }, note: { vi: 'Lời chúc và âm nhạc', en: 'Wishes and music' } },
    { time: '13:30', sketch: 'scooter',  title: { vi: 'Tiễn khách', en: 'Farewell' }, note: { vi: 'Hẹn gặp lại', en: 'Until next time' } }
  ],

  /* Photos. Leave a path empty ('') to show the designed placeholder.
     Album: add one line per photo. orientation: 'portrait' or 'landscape'.
     Placeholder tiles are shown automatically while `album` is empty. */
  photos: {
    hero: '',                 // TODO e.g. 'assets/images/hero.webp'
    heroAlt: { vi: 'Ảnh cưới của Bảo Phi và Thúy Linh', en: 'Bảo Phi and Thúy Linh' },
    album: [
      // { src: 'assets/images/album/01.webp', orientation: 'portrait',  caption: { vi: 'Forever always', en: 'Forever always' } },
      // { src: 'assets/images/album/02.webp', orientation: 'landscape', caption: null },
    ],
    // Layout used for placeholders while the album is empty (8 tiles).
    placeholderLayout: ['portrait', 'portrait', 'landscape', 'portrait', 'portrait', 'landscape', 'portrait', 'portrait']
  },

  music: {
    src: 'assets/music/background.mp3', // TODO drop an mp3 here; the toggle hides itself if missing
    volume: 0.5,
    autoplayOnOpen: true                // starts when the guest taps "Mở thiệp"
  },

  effects: {
    petals: true                        // falling petals on the cover only
  },

  rsvp: {
    // TODO paste the Apps Script Web App URL ending in /exec. Empty = demo mode (nothing is saved).
    endpoint: 'https://script.google.com/macros/s/AKfycbxjiuQYJ7qGK88pBZHi_Ij7PLKIIIxXv-l59TtT4gqjbFhhY7jWUlFP4LzgLf7ev1YEww/exec',
    deadline: { vi: 'Vui lòng phản hồi trước ngày 20.12.2026', en: 'Kindly reply by 20 December 2026' } // TODO confirm
  },

  story: [ // 2–4 milestones; [] hides the section. Example:
    // { year: '2019', title: { vi: 'Lần đầu gặp gỡ', en: 'First meeting' }, text: { vi: '...', en: '...' } },
  ],

  gifts: [ // TODO real bank details and QR images, or [] to hide the section
    { side: { vi: 'Chú rể', en: 'Groom' }, bank: 'Ngân hàng', holder: 'DOAN BAO PHI', number: '0000000000', qr: '' },
    { side: { vi: 'Cô dâu', en: 'Bride' }, bank: 'Ngân hàng', holder: 'PHAM THUY LINH', number: '0000000000', qr: '' }
  ],

  /* All interface copy. Keys are referenced by data-i18n in index.html. */
  text: {
    vi: {
      coverKicker: 'Thiệp mời',
      coverGreeting: 'Trân trọng kính mời Quý khách',
      coverOpen: 'Mở thiệp',
      heroKicker: 'Trân trọng kính mời',
      heroLead: 'đến dự lễ thành hôn của chúng tôi',
      photoLabel: 'Ảnh cưới',
      familyTitle: 'Gia đình hai bên',
      groomLabel: 'Chú rể', brideLabel: 'Cô dâu',
      groomSide: 'Nhà trai',
      brideSide: 'Nhà gái',
      familyIntro: 'Trân trọng báo tin lễ thành hôn của con chúng tôi',
      eventsTitle: 'Tiệc cưới',
      programTitle: 'Chương trình',
      directions: 'Chỉ đường',
      factTime: 'Giờ', factDate: 'Ngày', factLunar: 'Âm lịch', doors: 'Đón khách {t}', factWhere: 'Địa chỉ',
      addCalendar: 'Lưu vào lịch',
      calendarIcs: 'Tải tệp .ics',
      calendarGoogle: 'Google Calendar',
      countdownTitle: 'Còn lại',
      days: 'ngày', hours: 'giờ', minutes: 'phút',
      countdownDone: 'Hôm nay là ngày vui của chúng tôi',
      albumTitle: 'Khoảnh khắc',
      albumSoon: 'Ảnh sẽ được cập nhật',
      storyTitle: 'Chuyện chúng mình',
      giftTitle: 'Mừng cưới',
      giftIntro: 'Sự hiện diện của Quý khách là món quà ý nghĩa nhất. Nếu muốn gửi lời chúc từ xa, xin mời:',
      giftToggleOpen: 'Xem thông tin',
      giftToggleClose: 'Thu gọn',
      bank: 'Ngân hàng', holder: 'Chủ tài khoản', account: 'Số tài khoản',
      copy: 'Sao chép số tài khoản', copied: 'Đã sao chép',
      qrSoon: 'Mã QR',
      rsvpTitle: 'Xác nhận tham dự',
      fName: 'Họ và tên', fNameHint: 'Tên mà cô dâu chú rể quen gọi',
      fAttending: 'Quý khách sẽ đến chứ?', yes: 'Rất hân hạnh tham dự', no: 'Rất tiếc, không thể đến',
      fGuests: 'Số người tham dự', other: 'Khác', fGuestsOther: 'Số người',
      fEvents: 'Quý khách sẽ dự',
      fSide: 'Quý khách là khách của', sideGroom: 'Nhà trai', sideBride: 'Nhà gái', sideBoth: 'Cả hai',
      fDiet: 'Lưu ý ăn uống', fDietHint: 'Ăn chay, dị ứng…',
      fMessage: 'Lời nhắn gửi cô dâu chú rể',
      submit: 'Gửi xác nhận', sending: 'Đang gửi…',
      errName: 'Vui lòng nhập họ tên.',
      errAttending: 'Vui lòng chọn một câu trả lời.',
      errGuests: 'Vui lòng nhập số người (1 đến 20).',
      errEvents: 'Vui lòng chọn ít nhất một nghi lễ.',
      errSubmit: 'Chưa gửi được. Vui lòng kiểm tra kết nối và thử lại.',
      demoNote: 'Chế độ xem thử: phản hồi chưa được lưu (chưa cấu hình Google Sheet).',
      thanksYes: 'Cảm ơn {name}! Chúng tôi rất mong được gặp Quý khách trong ngày vui.',
      thanksNo: 'Cảm ơn {name} đã phản hồi. Chúng tôi sẽ nhớ đến Quý khách trong ngày vui.',
      edit: 'Sửa câu trả lời',
      closingTitle: 'Trân trọng cảm ơn',
      closingText: 'Sự hiện diện của Quý khách là niềm vinh hạnh cho gia đình chúng tôi.',
      musicOn: 'Bật nhạc', musicOff: 'Tắt nhạc',
      close: 'Đóng', prev: 'Ảnh trước', next: 'Ảnh sau',
      weekdays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
    },
    en: {
      coverKicker: 'Wedding invitation',
      coverGreeting: 'You are warmly invited',
      coverOpen: 'Open invitation',
      heroKicker: 'We’re getting married',
      heroLead: 'and would be honoured by your presence',
      photoLabel: 'Wedding photo',
      familyTitle: 'Our families',
      groomLabel: 'The groom', brideLabel: 'The bride',
      groomSide: 'Groom’s family',
      brideSide: 'Bride’s family',
      familyIntro: 'Together with their families, request the pleasure of your company',
      eventsTitle: 'The reception',
      programTitle: 'The evening',
      directions: 'Directions',
      factTime: 'Time', factDate: 'Date', factLunar: 'Lunar date', doors: 'Doors open {t}', factWhere: 'Address',
      addCalendar: 'Add to calendar',
      calendarIcs: 'Download .ics',
      calendarGoogle: 'Google Calendar',
      countdownTitle: 'Counting down',
      days: 'days', hours: 'hours', minutes: 'minutes',
      countdownDone: 'Today is our wedding day',
      albumTitle: 'Moments',
      albumSoon: 'Photos coming soon',
      storyTitle: 'Our story',
      giftTitle: 'Wedding gift',
      giftIntro: 'Your presence is the greatest gift. If you wish to send your blessing from afar:',
      giftToggleOpen: 'Show details',
      giftToggleClose: 'Hide',
      bank: 'Bank', holder: 'Account holder', account: 'Account number',
      copy: 'Copy account number', copied: 'Copied',
      qrSoon: 'QR code',
      rsvpTitle: 'Kindly reply',
      fName: 'Full name', fNameHint: 'Your name as the couple knows you',
      fAttending: 'Will you attend?', yes: 'Joyfully accepts', no: 'Regretfully declines',
      fGuests: 'Number of guests', other: 'Other', fGuestsOther: 'Guests',
      fEvents: 'I will attend',
      fSide: 'You are a guest of', sideGroom: 'The groom', sideBride: 'The bride', sideBoth: 'Both',
      fDiet: 'Dietary notes', fDietHint: 'Vegetarian, allergies…',
      fMessage: 'A message for the couple',
      submit: 'Send reply', sending: 'Sending…',
      errName: 'Please enter your name.',
      errAttending: 'Please choose an answer.',
      errGuests: 'Please enter a number from 1 to 20.',
      errEvents: 'Please choose at least one event.',
      errSubmit: 'Your reply could not be sent. Please check your connection and try again.',
      demoNote: 'Preview mode: replies are not saved yet (Google Sheet not configured).',
      thanksYes: 'Thank you, {name}! We can’t wait to celebrate with you.',
      thanksNo: 'Thank you for letting us know, {name}. You will be in our hearts on the day.',
      edit: 'Change my reply',
      closingTitle: 'With gratitude',
      closingText: 'Your presence would be the greatest honour for our families.',
      musicOn: 'Play music', musicOff: 'Pause music',
      close: 'Close', prev: 'Previous photo', next: 'Next photo',
      weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  }
};
