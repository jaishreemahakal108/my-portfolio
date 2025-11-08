import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import toast, { Toaster } from "react-hot-toast";
import { Typewriter } from "react-simple-typewriter";
import { FaLinkedin, FaGithub, FaCode } from "react-icons/fa";

export default function Contact() {
  const [leetcode, setLeetcode] = useState(null);
  const [github, setGithub] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    fetch("https://leetcode-stats-api.herokuapp.com/jaishreemahakal108")
      .then((r) => r.json())
      .then(setLeetcode)
      .catch(() => toast.error("LeetCode stats unavailable"));

    fetch("https://api.github.com/users/jaishreemahakal108")
      .then((r) => r.json())
      .then(setGithub)
      .catch(() => toast.error("GitHub stats unavailable"));
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Rajaswa_Anand.pdf";
    link.download = "Rajaswa_Anand.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloading Resume...");
  };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message)
            return toast.error("Please fill all fields.");
        if (!window.confirm("Send this message via your email client?")) return;

        // 📨 Formal Email Template
        const body = `
        Dear Rajaswa Anand,

        I hope you're doing well.

        My name is ${form.name}, and I wanted to get in touch regarding:
        "${form.message}"

        Please feel free to reach me at ${form.email} if you’d like to discuss this further.
        Looking forward to connecting with you soon.

        Warm regards,  
        ${form.name}  
        ${form.email}
        `;

        const mailto = `mailto:rajaswaanand108@gmail.com?subject=${encodeURIComponent(
            `New Collaboration / Message from ${form.name}`
        )}&body=${encodeURIComponent(body)}`;

        toast.success("Opening your email app...");
        window.location.href = mailto;
        setForm({ name: "", email: "", message: "" });
    };


  const leetPercent =
    leetcode && leetcode.totalQuestions
      ? Math.round((leetcode.totalSolved / leetcode.totalQuestions) * 100)
      : 0;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-gray-900 to-black text-white flex flex-col items-center px-6 py-16 overflow-hidden">
      <Toaster position="bottom-center" />
      {/* floating background glow */}
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none"
        animate={{ y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      >
        <div className="w-full h-full bg-linear-to-br from-yellow-400/10 via-transparent to-purple-700/10 blur-3xl" />
      </motion.div>

      {/* header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">
          Let's Connect
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-300 font-medium">
          <Typewriter
            words={[
              "I'm open for collaborations 🤝",
              "Let's build something amazing 💻",
              "Hire me for your next big idea 🚀",
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </h2>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
        {/* LinkedIn */}
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
          <div className="flex flex-col justify-between h-full text-center rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-500 hover:shadow-[#0a66c2]/40 hover:shadow-xl">
            <div>
              <img
                src="/profile.png"
                alt="profile"
                className="w-24 h-24 mx-auto rounded-full border-4 border-white/70 mb-3 object-cover"
              />
              <h3 className="text-2xl font-semibold text-white mb-1">LinkedIn</h3>
              <p className="text-gray-300">@rajaswa-anand</p>
              <p className="text-sm text-gray-400 mt-2">
                Full Stack Developer | MERN & AI
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Let’s connect and collaborate on tech, startups, or ideas.
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-semibold shadow transition-all"
            >
              Download Resume
            </button>
          </div>
        </Tilt>

        {/* GitHub */}
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
          <div className="flex flex-col justify-between h-full text-center rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-500 hover:shadow-white/40 hover:shadow-xl">
            <div>
              <FaGithub className="text-5xl text-white mx-auto mb-3" />
              <h3 className="text-2xl font-semibold text-white mb-1">GitHub</h3>
              <p className="text-gray-300 mb-2">
                @{github?.login ?? "jaishreemahakal108"}
              </p>
              <p className="text-sm text-gray-400">
                Public Repos: {github?.public_repos ?? "—"}
              </p>
              <p className="text-sm text-gray-400">
                Followers: {github?.followers ?? "—"}
              </p>
              <p className="text-sm text-gray-400">
                Following: {github?.following ?? "—"}
              </p>
            </div>
            <a
              href="https://github.com/jaishreemahakal108"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Visit Profile
            </a>
          </div>
        </Tilt>

        {/* LeetCode */}
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
          <div className="flex flex-col justify-between h-full text-center rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-yellow-400/20 transition-all duration-500 hover:shadow-yellow-400/40 hover:shadow-xl">
            <div>
              <img
                src="/profile.png"
                alt="profile"
                className="w-24 h-24 mx-auto rounded-full border-4 border-yellow-400 mb-3 object-cover"
              />
              <h3 className="text-2xl font-semibold text-yellow-400 mb-1">
                LeetCode
              </h3>
              <p className="text-gray-300">@jaishreemahakal108</p>

              {leetcode ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-400">
                    Solved{" "}
                    <span className="text-white font-semibold">
                      {leetcode.totalSolved}
                    </span>{" "}
                    / {leetcode.totalQuestions}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${leetPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-green-400">
                      Easy: {leetcode.easySolved}
                    </span>
                    <span className="text-orange-400">
                      Med: {leetcode.mediumSolved}
                    </span>
                    <span className="text-red-400">
                      Hard: {leetcode.hardSolved}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Rank:{" "}
                    <span className="text-white font-semibold">
                      {leetcode.ranking}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 mt-4">Loading LeetCode stats...</p>
              )}
            </div>
            <a
              href="https://leetcode.com/u/jaishreemahakal108/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all"
            >
              View Profile
            </a>
          </div>
        </Tilt>
      </div>

      {/* contact form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400 text-center">
          Send me a message
        </h2>
        <div className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold transition-all"
          >
            Send via Email Client
          </button>
        </div>
      </motion.form>
    </div>
  );
}