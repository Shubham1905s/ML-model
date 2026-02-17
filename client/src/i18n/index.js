import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        home: "Home",
        login: "Login",
        logout: "Logout",
        signup: "Sign up",
        profile: "Profile",
        search: "Search",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        submit: "Submit",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        back: "Back",
        next: "Next",
        previous: "Previous",
        yes: "Yes",
        no: "No"
      },
      nav: {
        home: "Home",
        hostDashboard: "Host Dashboard",
        admin: "Admin",
        becomeHost: "Become a Host"
      },
      auth: {
        welcomeBack: "Welcome back",
        loginSubtitle: "Login to manage your stays and listings.",
        createAccount: "Create account",
        signupSubtitle: "Join to book stays or host your space.",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm password",
        fullName: "Full name",
        mobileNumber: "Mobile number",
        accountType: "Account type",
        guest: "Guest",
        host: "Host",
        forgotPassword: "Forgot password?",
        noAccount: "New here?",
        haveAccount: "Already have an account?",
        loginLink: "Login",
        registerLink: "Create account",
        termsAccepted: "I agree to the Terms and Conditions",
        signingIn: "Signing in...",
        pleaseWait: "Please wait...",
        loginFailed: "Login Failed",
        registrationError: "Registration Error"
      },
      home: {
        hero: {
          eyebrow: "Trusted stays across India",
          title: "Book stays that feel like home, instantly.",
          subtitle: "Find verified homes, villas, and hotels in top destinations with transparent pricing and guest-first support.",
          exploreStays: "Explore stays",
          becomeHost: "Become a host"
        },
        search: {
          title: "Search stays",
          subtitle: "Filter by location, guests, and property type to find the right stay.",
          location: "Location",
          guests: "Guests",
          propertyType: "Property type",
          any: "Any",
          hotel: "Hotel",
          apartment: "Apartment",
          villa: "Villa",
          hostel: "Hostel",
          searchBtn: "Search",
          found: "Found {{count}} stays for {{location}}"
        },
        featured: "Featured properties",
        filters: {
          priceLowHigh: "Price: Low to High",
          priceHighLow: "Price: High to Low",
          topRated: "Top Rated",
          mostPopular: "Most Popular"
        },
        details: {
          title: "Property details",
          checkIn: "Check-in",
          checkOut: "Check-out",
          blackoutDates: "Blackout Dates",
          noBlackout: "No blocked dates",
          viewDetails: "View details",
          noProperty: "No property selected."
        },
        booking: {
          title: "Book this stay",
          checkIn: "Check-in",
          checkOut: "Check-out",
          guests: "Guests",
          paymentMethod: "Payment method",
          onsitePayment: "Onsite Payment (Pay at property)",
          netBanking: "Net Banking",
          upi: "UPI",
          terms: "I agree to Terms and Conditions",
          basePrice: "Base price ({{nights}} nights)",
          taxes: "Taxes",
          platformFee: "Platform fee",
          total: "Total",
          bookNow: "Book now",
          booking: "Booking...",
          hostCannotBook: "Host users cannot book properties.",
          loginToBook: "Please login as a guest user to book."
        },
        dashboard: {
          title: "Guest dashboard",
          bookings: "Bookings",
          noBookings: "No bookings yet.",
          reviews: "Reviews"
        },
        popularDestinations: "Popular destinations",
        noProperty: "No property selected.",
        nights: "{{count}} nights",
        perNight: "/ night",
        rating: "{{rating}} / 5",
        upToGuests: "Up to {{count}} guests"
      },
      forgotPassword: {
        title: "Reset password",
        subtitle: "Enter your email to receive a reset OTP.",
        sendOtp: "Send OTP",
        sending: "Sending...",
        otpSent: "OTP sent. Dev OTP preview: {{otp}}",
        verifyOtp: "Verify OTP",
        enterOtp: "Enter OTP",
        newPassword: "New password",
        resetPassword: "Reset Password",
        resetting: "Resetting...",
        success: "Password reset successful!",
        backToLogin: "Back to Login"
      },
      profile: {
        title: "Profile",
        personalInfo: "Personal Information",
        name: "Name",
        email: "Email",
        phone: "Phone",
        role: "Role",
        noBookings: "No bookings found.",
        noListings: "No listings found."
      },
      becomeHost: {
        title: "Become a Host",
        subtitle: "List your property and start earning.",
        propertyName: "Property Name",
        propertyType: "Property Type",
        description: "Description",
        pricePerNight: "Price per night (INR)",
        maxGuests: "Maximum Guests",
        address: "Address",
        city: "City",
        state: "State",
        amenities: "Amenities",
        wifi: "WiFi",
        parking: "Parking",
        pool: "Pool",
        ac: "AC",
        kitchen: "Kitchen",
        submit: "List Property",
        submitting: "Submitting...",
        success: "Property listed successfully!"
      },
      hostDashboard: {
        title: "Host Dashboard",
        myListings: "My Listings",
        totalEarnings: "Total Earnings",
        totalBookings: "Total Bookings",
        noListings: "No listings yet."
      },
      adminDashboard: {
        title: "Admin Dashboard",
        totalUsers: "Total Users",
        totalProperties: "Total Properties",
        totalBookings: "Total Bookings",
        pendingApprovals: "Pending Approvals"
      },
      footer: {
        description: "Dummy MERN booking platform for demo and planning.",
        support: "Support",
        supportEmail: "help@stayease.demo"
      },
      errors: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email",
        passwordMin: "Password must be at least 8 characters",
        passwordMismatch: "Passwords do not match",
        acceptTerms: "Please accept terms and conditions",
        loginFailed: "Login failed. Please check your credentials.",
        networkError: "Network error. Please try again.",
        bookingFailed: "Booking failed. Please try again."
      },
      captcha: {
        enterCode: "Enter the code shown above",
        refresh: "Refresh"
      }
    }
  },
  hi: {
    translation: {
      common: {
        home: "होम",
        login: "लॉग इन",
        logout: "लॉग आउट",
        signup: "साइन अप",
        profile: "प्रोफाइल",
        search: "खोज",
        loading: "लोड हो रहा है...",
        error: "त्रुटि",
        success: "सफल",
        cancel: "रद्द करें",
        submit: "सबमिट",
        save: "सहेजें",
        edit: "संपादित करें",
        delete: "हटाएं",
        back: "वापस",
        next: "अगला",
        previous: "पिछला",
        yes: "हां",
        no: "नहीं"
      },
      nav: {
        home: "होम",
        hostDashboard: "होस्ट डैशबोर्ड",
        admin: "एडमिन",
        becomeHost: "होस्ट बनें"
      },
      auth: {
        welcomeBack: "वापसी पर स्वागत है",
        loginSubtitle: "अपने स्टे और लिस्टिंग प्रबंधित करने के लिए लॉग इन करें।",
        createAccount: "खाता बनाएं",
        signupSubtitle: "स्टे बुक करने या अपनी जगह होस्ट करने के लिए जुड़ें।",
        email: "ईमेल",
        password: "पासवर्ड",
        confirmPassword: "पासवर्ड की पुष्टि करें",
        fullName: "पूरा नाम",
        mobileNumber: "मोबाइल नंबर",
        accountType: "खाते का प्रकार",
        guest: "अतिथि",
        host: "होस्ट",
        forgotPassword: "पासवर्ड भूल गए?",
        noAccount: "नए हैं?",
        haveAccount: "पहले से खाता है?",
        loginLink: "लॉग इन करें",
        registerLink: "खाता बनाएं",
        termsAccepted: "मैं नियम और शर्तों से सहमत हूं",
        signingIn: "साइन इन हो रहा है...",
        pleaseWait: "कृपया प्रतीक्षा करें...",
        loginFailed: "लॉगिन विफल",
        registrationError: "पंजीकरण त्रुटि"
      },
      home: {
        hero: {
          eyebrow: "भारत भर में विश्वसनीय स्टे",
          title: "घर जैसा महसूस होने वाले स्टे तुरंत बुक करें।",
          subtitle: "पारदर्शी मूल्य निर्धारण और अतिथि-प्रथम सहायता के साथ शीर्ष गंतव्यों में सत्यापित घरों, विला और होटल खोजें।",
          exploreStays: "स्टे देखें",
          becomeHost: "होस्ट बनें"
        },
        search: {
          title: "स्टे खोजें",
          subtitle: "सही स्टे खोजने के लिए स्थान, अतिथियों और संपत्ति के प्रकार से फ़िल्टर करें।",
          location: "स्थान",
          guests: "अतिथि",
          propertyType: "संपत्ति का प्रकार",
          any: "कोई भी",
          hotel: "होटल",
          apartment: "अपार्टमेंट",
          villa: "विला",
          hostel: "हॉस्टल",
          searchBtn: "खोजें",
          found: "{{location}} के लिए {{count}} स्टे मिले"
        },
        featured: "विशेष गुण",
        filters: {
          priceLowHigh: "कीमत: कम से अधिक",
          priceHighLow: "कीमत: अधिक से कम",
          topRated: "सबसे अधिक रेटेड",
          mostPopular: "सबसे लोकप्रिय"
        },
        details: {
          title: "संपत्ति विवरण",
          checkIn: "चेक-इन",
          checkOut: "चेक-आउट",
          blackoutDates: "ब्लैकआउट तिथियां",
          noBlackout: "कोई अवरुद्ध तिथि नहीं",
          viewDetails: "विवरण देखें",
          noProperty: "कोई संपत्ति चयनित नहीं।"
        },
        booking: {
          title: "यह स्टे बुक करें",
          checkIn: "चेक-इन",
          checkOut: "चेक-आउट",
          guests: "अतिथि",
          paymentMethod: "भुगतान का तरीका",
          onsitePayment: "ऑनसाइट भुगतान (प्रॉपर्टी पर भुगतान)",
          netBanking: "नेट बैंकिंग",
          upi: "UPI",
          terms: "मैं नियम और शर्तों से सहमत हूं",
          basePrice: "बेस कीमत ({{nights}} रातें)",
          taxes: "कर",
          platformFee: "प्लेटफॉर्म शुल्क",
          total: "कुल",
          bookNow: "अभी बुक करें",
          booking: "बुकिंग...",
          hostCannotBook: "होस्ट उपयोगकर्ता संपत्तियां बुक नहीं कर सकते।",
          loginToBook: "कृपया अतिथि उपयोगकर्ता के रूप में लॉग इन करें।"
        },
        dashboard: {
          title: "अतिथि डैशबोर्ड",
          bookings: "बुकिंग",
          noBookings: "अभी तक कोई बुकिंग नहीं।",
          reviews: "समीक्षाएं"
        },
        popularDestinations: "लोकप्रिय गंतव्य",
        noProperty: "कोई संपत्ति चयनित नहीं।",
        nights: "{{count}} रातें",
        perNight: "/ रात",
        rating: "{{rating}} / 5",
        upToGuests: "{{count}} अतिथियों तक"
      },
      forgotPassword: {
        title: "पासवर्ड रीसेट करें",
        subtitle: "रीसेट OTP प्राप्त करने के लिए अपना ईमेल दर्ज करें।",
        sendOtp: "OTP भेजें",
        sending: "भेज रहा है...",
        otpSent: "OTP भेजा गया। डेव OTP पूर्वावलोकन: {{otp}}",
        verifyOtp: "OTP सत्यापित करें",
        enterOtp: "OTP दर्ज करें",
        newPassword: "नया पासवर्ड",
        resetPassword: "पासवर्ड रीसेट करें",
        resetting: "रीसेट हो रहा है...",
        success: "पासवर्ड सफलतापूर्वक रीसेट हो गया!",
        backToLogin: "लॉगिन पर वापस जाएं"
      },
      profile: {
        title: "प्रोफाइल",
        personalInfo: "व्यक्तिगत जानकारी",
        name: "नाम",
        email: "ईमेल",
        phone: "फोन",
        role: "भूमिका",
        noBookings: "कोई बुकिंग नहीं मिली।",
        noListings: "कोई लिस्टिंग नहीं मिली।"
      },
      becomeHost: {
        title: "होस्ट बनें",
        subtitle: "अपनी संपत्ति सूचीबद्ध करें और कमाई शुरू करें।",
        propertyName: "संपत्ति का नाम",
        propertyType: "संपत्ति का प्रकार",
        description: "विवरण",
        pricePerNight: "प्रति रात कीमत (INR)",
        maxGuests: "अधिकतम अतिथि",
        address: "पता",
        city: "शहर",
        state: "राज्य",
        amenities: "सुविधाएं",
        wifi: "वाईफाई",
        parking: "पार्किंग",
        pool: "पूल",
        ac: "एसी",
        kitchen: "किचन",
        submit: "संपत्ति सूचीबद्ध करें",
        submitting: "सबमिट हो रहा है...",
        success: "संपत्ति सफलतापूर्वक सूचीबद्ध हो गई!"
      },
      hostDashboard: {
        title: "होस्ट डैशबोर्ड",
        myListings: "मेरी लिस्टिंग",
        totalEarnings: "कुल कमाई",
        totalBookings: "कुल बुकिंग",
        noListings: "अभी तक कोई लिस्टिंग नहीं।"
      },
      adminDashboard: {
        title: "एडमिन डैशबोर्ड",
        totalUsers: "कुल उपयोगकर्ता",
        totalProperties: "कुल संपत्तियां",
        totalBookings: "कुल बुकिंग",
        pendingApprovals: "लंबित अनुमोदन"
      },
      footer: {
        description: "डेमो और प्लानिंग के लिए डमी MERN बुकिंग प्लेटफॉर्म।",
        support: "सहायता",
        supportEmail: "help@stayease.demo"
      },
      errors: {
        required: "यह फ़ील्ड आवश्यक है",
        invalidEmail: "कृपया एक मान्य ईमेल दर्ज करें",
        passwordMin: "पासवर्ड कम से कम 8 अक्षर का होना चाहिए",
        passwordMismatch: "पासवर्ड मेल नहीं खाते",
        acceptTerms: "कृपया नियम और शर्तों को स्वीकार करें",
        loginFailed: "लॉगिन विफल। कृपया अपने क्रेडेंशियल जांचें।",
        networkError: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
        bookingFailed: "बुकिंग विफल। कृपया पुनः प्रयास करें।"
      },
      captcha: {
        enterCode: "ऊपर दिखाए गए कोड को दर्ज करें",
        refresh: "रीफ्रेश"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
