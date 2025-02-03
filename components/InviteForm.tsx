"use client";

import { getInvite, submitInviteResponse } from "@/app/actions/invite";
import { Invite } from "@/utils/interfaces/InviteType";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  Mail,
  MapPin,
  MapPinned,
  Music,
  PartyPopper,
  Phone,
  Sun,
  User,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

interface InviteFormProps {
  inviteId: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  additional_guests: number;
  events: {
    haldi: boolean;
    sangeet: boolean;
    wedding: boolean;
    reception: boolean;
  };
}

type MessageType = "success" | "error";

interface Message {
  type: MessageType;
  text: string;
}

interface Venue {
  name: string;
  address: string;
  coordinates: [number, number]; // [latitude, longitude]
}

const venues: Record<string, Venue> = {
  ashelynnManor: {
    name: "Ashelynn Manor",
    address: "25276 Nichols Sawmill Rd, Magnolia, TX 77355",
    coordinates: [30.1877, -95.7502], // Approximate coordinates
  },
  agOutdoor: {
    name: "AG Outdoor Venue",
    address: "17439 Self Rd, Tomball, TX 77377",
    coordinates: [30.0933, -95.6747], // Approximate coordinates
  },
};

const EventInfo = {
  haldi: {
    title: "Haldi Ceremony",
    description:
      "Join us as we kick off the wedding celebrations with our Haldi ceremony! A joyous and colorful tradition, this event is filled with love, laughter, and blessings as we prepare for the big day.",
    icon: Sun,
    date: "March 4th, 2025",
    time: "1:00 PM – 3:00 PM",
    venue: venues.ashelynnManor,
  },
  sangeet: {
    title: "Sangeet Night",
    description:
      "Let's dance the night away at our Sangeet! Filled with music, performances, and celebration, this evening is all about fun, family, and festive vibes. Come ready to groove and enjoy an unforgettable night!",
    icon: Music,
    date: "March 4th, 2025",
    time: "6:30 PM – 11:00 PM",
    venue: venues.ashelynnManor,
  },
  wedding: {
    title: "Wedding Ceremony",
    description:
      "The moment we've been waiting for! Surrounded by our loved ones, we will exchange vows and begin our new journey together. We can't wait to celebrate this special milestone with you!",
    icon: MapPin,
    date: "March 6th, 2025",
    time: "10:00 AM – 2:00 PM",
    venue: venues.agOutdoor,
  },
  reception: {
    title: "Reception Celebration",
    description:
      "After the \"I do's,\" it's time to party! Join us for an elegant evening of dinner, drinks, and dancing as we celebrate the start of our forever.",
    icon: PartyPopper,
    date: "March 6th, 2025",
    time: "6:00 PM – 11:30 PM",
    venue: venues.agOutdoor,
  },
};

const COUPLE_INFO = {
  groom: {
    name: "Kaushal Subedi",
    parents: {
      father: "Mr. Krishna Raj Subedi",
      mother: "Mrs. Suna Kumari Sapkota Subedi",
    },
  },
  bride: {
    name: "Priyanka Sharma",
    parents: {
      father: "Mr. Deepak Sharma",
      mother: "Mrs. Mamata Karna Sharma",
    },
  },
  date: {
    english: "March 6th, 2025",
    vikramSamvat: "Falgun 25, 2081", // You may want to verify this conversion
  },
};

export function InviteForm({ inviteId }: InviteFormProps) {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    additional_guests: 0,
    events: {
      haldi: false,
      sangeet: false,
      wedding: false,
      reception: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [invite, setInvite] = useState<Invite | null | undefined>(undefined);

  useEffect(() => {
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Update window size on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Load invite and pre-fill form data
    getInvite(inviteId).then((inviteData) => {
      setInvite(inviteData);
      if (inviteData) {
        // Pre-fill form with response data if it exists, otherwise use invite data
        if (inviteData.response) {
          setFormData({
            name: inviteData.response.name,
            email: inviteData.response.email,
            phone: inviteData.response.phone,
            additional_guests: inviteData.response.additional_guests,
            events: inviteData.response.events,
          });
        } else {
          // Pre-fill with invite data as before
          const defaultEvents = Object.keys(inviteData.events).reduce(
            (acc, key) => ({
              ...acc,
              [key]: inviteData.events[key as keyof typeof inviteData.events],
            }),
            {} as typeof inviteData.events
          );

          setFormData({
            name: inviteData.name || "",
            email: inviteData.email || "",
            phone: inviteData.phone || "",
            additional_guests: inviteData.additional_guests || 0,
            events: defaultEvents,
          });
        }
      }
    });

    return () => window.removeEventListener("resize", handleResize);
  }, [inviteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await submitInviteResponse({
        ...formData,
        inviteId,
      });

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setShowConfetti(true);
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          additional_guests: 0,
          events: {
            haldi: false,
            sangeet: false,
            wedding: false,
            reception: false,
          },
        });
        // Stop confetti after 8 seconds
        setTimeout(() => setShowConfetti(false), 8000);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const eventName = name.replace(
        "event_",
        ""
      ) as keyof typeof formData.events;
      setFormData((prev) => ({
        ...prev,
        events: {
          ...prev.events,
          [eventName]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (invite === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-amber-800">Loading invitation details...</p>
      </div>
    );
  }

  if (invite === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-600">Invalid Invitation</h2>
        <p className="mt-4 text-gray-700">
          We couldn&apos;t find your invitation. Please contact the hosts for
          assistance.
        </p>
      </div>
    );
  }

  if (message?.type === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={true}
              numberOfPieces={200}
              gravity={0.2}
              colors={["#f87171", "#fbbf24", "#fb923c", "#f472b6"]}
              tweenDuration={5000}
            />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-auto text-center space-y-8 py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-red-400 to-amber-400 rounded-full mx-auto flex items-center justify-center"
          >
            <PartyPopper className="w-12 h-12 text-white" />
          </motion.div>

          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-amber-900"
            >
              {invite?.response ? "Response Updated!" : "Wonderful!"}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-700"
            >
              {invite?.response
                ? "Thank you for updating your response. We&apos;ve noted your changes!"
                : "Thank you for confirming your attendance. We can&apos;t wait to celebrate our special day with you!"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-6"
            >
              <p className="text-amber-700 font-medium">
                Save the Date: March 6th, 2025
              </p>
              <p className="text-gray-600 text-sm mt-2">
                We&apos;ll send you more details via email soon.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      {/* Wedding Invitation Header */}
      <div
        className={`w-full max-w-4xl mx-auto text-center mb-12 space-y-8 ${inter.className}`}
      >
        <div className="space-y-8">
          {/* Sanskrit Blessing */}
          <h1
            className={`text-3xl md:text-4xl text-amber-800 font-serif leading-relaxed`}
          >
            श्री गणेशाय नमः
          </h1>

          {/* Main Title */}
          <h2
            className={`text-4xl md:text-5xl text-amber-900 font-serif leading-relaxed tracking-wide`}
          >
            शुभ विवाह
          </h2>

          {/* Couple Names and Parents */}
          <div className="space-y-10 py-8">
            {/* Groom's Details */}
            <div className="space-y-3">
              <h3
                className={`${playfair.className} text-3xl md:text-4xl text-amber-800 leading-relaxed`}
              >
                {COUPLE_INFO.groom.name}
              </h3>
              <p className="text-gray-600 italic text-lg">
                (Son of {COUPLE_INFO.groom.parents.father} &{" "}
                {COUPLE_INFO.groom.parents.mother})
              </p>
            </div>

            {/* Decorative "and" */}
            <div
              className={`${playfair.className} text-2xl text-amber-700 italic`}
            >
              and
            </div>

            {/* Bride's Details */}
            <div className="space-y-3">
              <h3
                className={`${playfair.className} text-3xl md:text-4xl text-amber-800 leading-relaxed`}
              >
                {COUPLE_INFO.bride.name}
              </h3>
              <p className="text-gray-600 italic text-lg">
                (Daughter of {COUPLE_INFO.bride.parents.father} &{" "}
                {COUPLE_INFO.bride.parents.mother})
              </p>
            </div>
          </div>

          {/* Invitation Text */}
          <div className="max-w-2xl mx-auto space-y-6">
            <p className={`${playfair.className} text-xl text-gray-700`}>
              cordially invite you to celebrate their wedding
            </p>
            <div className="space-y-3">
              <p className={`${playfair.className} text-2xl text-amber-800`}>
                on {COUPLE_INFO.date.english}
                <br />
                <span className="text-base text-gray-600 mt-2 block">
                  ({COUPLE_INFO.date.vikramSamvat})
                </span>
              </p>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              With the blessings of our elders, we request your presence to
              grace this auspicious occasion and shower us with your love and
              blessings.
            </p>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
          <div className="w-8 h-8 bg-[url('/mandala-pattern.png')] bg-contain opacity-50" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto space-y-8"
      >
        {/* Personalized Greeting */}
        {invite?.name && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl font-bold text-amber-900">
              Dear {invite.name},
            </h2>
            <p className="text-gray-700">
              {invite.response
                ? "Would you like to update your response?"
                : "We are delighted to invite you to celebrate our special day with us!"}
            </p>
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-amber-100 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50 transition-colors disabled:opacity-50 text-gray-900 placeholder:text-gray-500"
              disabled={isLoading}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-amber-100 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50 transition-colors disabled:opacity-50 text-gray-900 placeholder:text-gray-500"
              disabled={isLoading}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-amber-100 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50 transition-colors disabled:opacity-50 text-gray-900 placeholder:text-gray-500"
              disabled={isLoading}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 top-0 left-3 flex items-center pointer-events-none">
              <UserRound className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="additional_guests"
              value={formData.additional_guests}
              onChange={handleChange}
              min="0"
              max="5"
              placeholder="Additional Guests (0-5)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-amber-100 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50 transition-colors disabled:opacity-50 text-gray-900 placeholder:text-gray-500"
              disabled={isLoading}
            />
            <div className="mt-1 text-xs text-gray-500 ml-3">
              Number of additional guests you&apos;d like to bring (maximum 5)
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-lg font-semibold text-amber-900 text-center">
            Events You&apos;re Invited To:
          </div>
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(EventInfo).map(([key, event]) => {
              const EventIcon = event.icon;
              const isInvited =
                invite.events[key as keyof typeof formData.events];
              const isSelected =
                formData.events[key as keyof typeof formData.events];

              if (!isInvited) return null;

              return (
                <motion.div
                  key={key}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <label className="block h-full cursor-pointer">
                    <div
                      className={`relative p-6 rounded-xl border-2 overflow-hidden transition-all duration-200 flex flex-col md:flex-row gap-6 ${
                        isSelected
                          ? "bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-lg"
                          : "bg-white/50 border-gray-200 opacity-75 hover:opacity-100"
                      }`}
                      onClick={() => {
                        handleChange({
                          target: {
                            name: `event_${key}`,
                            type: "checkbox",
                            checked: !isSelected,
                          },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }}
                    >
                      {/* Decorative elements - only show when selected */}
                      {isSelected && (
                        <>
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-amber-400 to-red-400" />
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-amber-400 to-red-400" />
                          <div className="absolute top-2 left-2 w-16 h-16 opacity-5 rotate-45 bg-[url('/mandala-pattern.png')] bg-contain" />
                          <div className="absolute bottom-2 right-2 w-16 h-16 opacity-5 -rotate-45 bg-[url('/mandala-pattern.png')] bg-contain" />
                        </>
                      )}

                      <div className="relative flex-1 min-h-[200px]">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              isSelected
                                ? "bg-amber-500 border-amber-600"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </motion.svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 border-b border-amber-100 pb-3 mb-3">
                              <div
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  isSelected
                                    ? "bg-gradient-to-br from-red-100 to-amber-100"
                                    : "bg-gray-100"
                                }`}
                              >
                                <EventIcon
                                  className={`w-5 h-5 ${
                                    isSelected
                                      ? "text-amber-700"
                                      : "text-gray-500"
                                  }`}
                                />
                              </div>
                              <span
                                className={`font-semibold text-lg transition-colors duration-200 ${
                                  isSelected
                                    ? "text-amber-900"
                                    : "text-gray-600"
                                }`}
                              >
                                {event.title}
                              </span>
                            </div>
                            <p
                              className={`text-sm mb-4 transition-colors duration-200 ${
                                isSelected ? "text-gray-600" : "text-gray-500"
                              }`}
                            >
                              {event.description}
                            </p>
                            <div className="space-y-3 text-sm">
                              <div
                                className={`flex items-center gap-2 transition-colors duration-200 ${
                                  isSelected
                                    ? "text-amber-800"
                                    : "text-gray-600"
                                }`}
                              >
                                <CalendarCheck className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">
                                  {event.date}
                                </span>
                              </div>
                              <div
                                className={`flex items-center gap-2 transition-colors duration-200 ${
                                  isSelected
                                    ? "text-amber-800"
                                    : "text-gray-600"
                                }`}
                              >
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">
                                  {event.time}
                                </span>
                              </div>
                              <div
                                className={`flex items-start gap-2 transition-colors duration-200 ${
                                  isSelected
                                    ? "text-amber-800"
                                    : "text-gray-600"
                                }`}
                              >
                                <MapPinned className="w-4 h-4 flex-shrink-0 mt-1" />
                                <div>
                                  <div className="font-medium">
                                    {event.venue.name}
                                  </div>
                                  <div
                                    className={`transition-colors duration-200 ${
                                      isSelected
                                        ? "text-amber-700/80"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {event.venue.address}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-64 my-auto relative pt-4 px-4 overflow-hidden shrink-0 flex items-center justify-center">
                        <Image
                          height="800"
                          width="800"
                          src={`/graphics/${key}.svg`}
                          alt={`${event.title} illustration`}
                          className={`rounded-2xl transition-all duration-200 ${
                            isSelected ? "opacity-100" : "opacity-70"
                          }`}
                        />
                      </div>
                    </div>
                  </label>
                </motion.div>
              );
            })}
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === ("success" as MessageType)
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-400 to-amber-400 text-white font-semibold shadow-lg hover:from-red-500 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : invite?.response ? (
            "Update Response"
          ) : (
            "Confirm Attendance"
          )}
        </button>
      </form>
    </div>
  );
}
