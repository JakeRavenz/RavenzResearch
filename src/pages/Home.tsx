import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Globe,
  ArrowRight,
  UserCircle,
  CheckCircle,
} from "lucide-react";
import heroImage from "../assets/images.png";
import reasonImage from "../assets/3718985.jpg";
import worldMap from "../assets/world.svg";
import startImage from "../assets/3624001.jpg";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import reviewerImg1 from "../assets/airfocus-e-qQv7FBiPM-unsplash.jpg";
import reviewerImg2 from "../assets/pooria-shahriari-9l4pbq7fTbY-unsplash.jpg";
import reviewerImg3 from "../assets/corinne-kutz-eeqFjT6q_sQ-unsplash.jpg";
import reviewerImg4 from "../assets/pooria-shahriari-YtmDrGPuCcU-unsplash.jpg";
import ravenzLogo from "../assets/Ravenz Research logo.png";
import airfocusImg from "../assets/airfocus-e-qQv7FBiPM-unsplash.jpg";
import globexImg from "../assets/pooria-shahriari-9l4pbq7fTbY-unsplash.jpg";
import acmeImg from "../assets/corinne-kutz-eeqFjT6q_sQ-unsplash.jpg";
import { useInView } from "react-intersection-observer";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl group relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
    <div className="inline-flex items-center justify-center mb-4 transition-transform shadow w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-100 via-indigo-200 to-indigo-300 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-700 group-hover:scale-105">
      {icon}
    </div>
    <h3 className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-300">
      {description}
    </p>
    {/* Decorative blurred gradient blob */}
    <span className="absolute z-0 w-24 h-24 rounded-full -top-6 -right-6 bg-gradient-to-tr from-indigo-300 via-blue-200 to-purple-200 dark:from-indigo-400/10 dark:via-indigo-700/10 dark:to-blue-900/10 blur-2xl" />
  </div>
);

const ActionButton: React.FC<{
  to: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}> = ({ to, variant, children }) => (
  <Link
    to={to}
    className={`${
      variant === "primary"
        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
        : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
    } px-6 py-3 font-medium transition-colors flex items-center gap-2`}
  >
    {children}
    {variant === "primary" && <ArrowRight className="w-4 h-4" />}
  </Link>
);

function JobsCarousel() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("jobs")
        .select(
          `id, title, location, type, remote_level, company:companies(name, logo_url)`
        )
        .eq("status", "Open")
        .order("created_at", { ascending: false })
        .limit(7);
      if (!error && data) setJobs(data);
    }
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setSlideCount(api.scrollSnapList().length);
    setCurrentSlide(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect); // Also update on re-initialization

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (!jobs.length) {
    return (
      <div className="mb-16">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-slate-200">
          Featured Jobs
        </h2>
        <div className="flex justify-center items-center min-h-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <span className="text-gray-500 dark:text-gray-300">
            Loading jobs...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16 ">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
        Featured Jobs
      </h2>
      <p className="mb-4 text-lg text-center text-gray-600 dark:text-slate-300 ">
        Discover exciting remote job opportunities tailored for you. Explore a
        range of flexible job opportunities ranging from easy online tasks to
        full-time work in our clients’ offices.
      </p>
      <p className="mb-6 text-lg text-center text-gray-600 dark:text-slate-300">
        Whether you’re looking for a side gig or a full-time career, we have
        options for you.
      </p>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi} // Pass the setApi function to get the API instance
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {jobs.map((job: any) => (
            <CarouselItem
              key={job.id}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
            >
              {/* Added p-1 to CarouselItem for gutter, card itself is now full width within this padding */}
              <div className="h-full p-1">
                {" "}
                {/* Ensure card takes full height of the item */}
                <div className="flex flex-col w-full h-full overflow-hidden transition-all duration-300 ease-in-out bg-white rounded-lg shadow-md dark:bg-gray-800 group hover:shadow-xl hover:-translate-y-1">
                  <div className="overflow-hidden">
                    <img
                      src={
                        job.company && job.company.logo_url
                          ? job.company.logo_url
                          : heroImage // Consider a more appropriate placeholder
                      }
                      alt={job.title}
                      className="object-fill w-full h-32 transition-transform duration-300 sm:h-36 md:h-40 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-3 text-center border sm:p-4">
                    <h3 className="mb-1 text-base font-semibold text-indigo-700 transition-colors md:text-lg dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
                      {job.title}
                    </h3>
                    <div className="mb-2 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                      {job.company?.name || "Unknown Company"}
                    </div>
                    <div className="flex items-center justify-around gap-4 mb-3 sm:gap-2">
                      <span className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full dark:text-yellow-300 dark:bg-yellow-700/30">
                        {job.remote_level === "fully_remote" ||
                        job.location?.toLowerCase() === "remote"
                          ? "Remote"
                          : job.location || "On-site"}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium text-purple-800 bg-purple-100 rounded-full sm:px-3 sm:py-1 dark:text-purple-300 dark:bg-purple-700/30">
                        {job.type || "N/A"}
                      </span>
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-block px-3 py-1.5 mt-auto text-xs font-semibold text-white transition-colors bg-indigo-600 rounded-md shadow-sm sm:text-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="absolute left-[-10px] sm:left-[-20px] md:left-[-30px] top-1/2 -translate-y-1/2 z-10" /> */}
        {/* <CarouselNext className="absolute right-[-10px] sm:right-[-20px] md:right-[-30px] top-1/2 -translate-y-1/2 z-10" /> */}
      </Carousel>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: slideCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out
              ${
                currentSlide === index
                  ? "bg-indigo-600 p-1"
                  : "bg-slate-100 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          to="/jobs"
          className="px-8 py-3 text-lg font-semibold text-white transition-colors bg-indigo-600 rounded shadow hover:bg-indigo-700"
        >
          View More Jobs
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [reviewApi, setReviewApi] = useState<CarouselApi>();
  const [reviewCurrentSlide, setReviewCurrentSlide] = useState(0);
  const [reviewSlideCount, setReviewSlideCount] = useState(0);

  const isRavenzEmployee =
    user && user.email && user.email.endsWith("@ravenzresearch.com");
  const features = [
    {
      icon: <Briefcase className="w-8 h-8 text-indigo-600" />,
      title: "Remote Jobs",
      description: "Find flexible remote positions from companies worldwide",
    },
    {
      icon: <Building2 className="w-8 h-8 text-indigo-600" />,
      title: "Top Companies",
      description: "Connect with leading companies embracing remote work",
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Work Anywhere",
      description: "Choose your workplace and maintain work-life balance",
    },
  ];

  // Stats animation logic
  const [statsInViewRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const [jobsCount, setJobsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [seekersCount, setSeekersCount] = useState(0);
  const [countriesCount, setCountriesCount] = useState(0);
  useEffect(() => {
    if (statsInView) {
      let jobsTarget = 1200,
        companiesTarget = 500,
        seekersTarget = 50000,
        countriesTarget = 40;
      let duration = 1200,
        steps = 30;
      let jobsStep = Math.ceil(jobsTarget / steps);
      let companiesStep = Math.ceil(companiesTarget / steps);
      let seekersStep = Math.ceil(seekersTarget / steps);
      let countriesStep = Math.ceil(countriesTarget / steps);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setJobsCount((prev) =>
          prev < jobsTarget ? Math.min(jobsTarget, prev + jobsStep) : jobsTarget
        );
        setCompaniesCount((prev) =>
          prev < companiesTarget
            ? Math.min(companiesTarget, prev + companiesStep)
            : companiesTarget
        );
        setSeekersCount((prev) =>
          prev < seekersTarget
            ? Math.min(seekersTarget, prev + seekersStep)
            : seekersTarget
        );
        setCountriesCount((prev) =>
          prev < countriesTarget
            ? Math.min(countriesTarget, prev + countriesStep)
            : countriesTarget
        );
        if (i >= steps) clearInterval(interval);
      }, duration / steps);
      return () => clearInterval(interval);
    }
  }, [statsInView]);

  useEffect(() => {
    if (!reviewApi) {
      return;
    }
    setReviewSlideCount(reviewApi.scrollSnapList().length);
    setReviewCurrentSlide(reviewApi.selectedScrollSnap());

    const onReviewSelect = () => {
      if (reviewApi) {
        setReviewCurrentSlide(reviewApi.selectedScrollSnap());
      }
    };

    reviewApi.on("select", onReviewSelect);
    reviewApi.on("reInit", onReviewSelect);

    return () => {
      reviewApi?.off("select", onReviewSelect);
      reviewApi?.off("reInit", onReviewSelect);
    };
  }, [reviewApi]);

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-slate-300 dark:bg-slate-900">
      {/* Hero Section - Background image with overlay */}
      <div className="relative flex flex-col justify-center items-center my-8 overflow-hidden h-[420px] md:h-[500px] rounded-lg shadow-lg">
        {/* Background image with gradient overlay */}
        <img
          src={String(heroImage)}
          loading="lazy"
          alt="hero background"
          className="absolute inset-0 z-0 object-cover w-full h-full"
          style={{ filter: "brightness(0.7) blur(1px)" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-indigo-900/70 via-indigo-700/60 to-blue-700/60" />
        {/* Overlayed content */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            Find Your Perfect Remote Job
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-indigo-100 md:text-xl drop-shadow">
            Connect with top companies hiring remote talent worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <ActionButton to="/jobs" variant="primary">
              Browse Jobs
            </ActionButton>
            {isRavenzEmployee && (
              <ActionButton to="/companies" variant="secondary">
                View Companies
              </ActionButton>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section - Enhanced */}
      <div className="relative py-12 mb-16 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        {/* Decorative blurred gradient blob */}
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <h2 className="relative z-10 mt-6 text-3xl font-bold text-center text-gray-700 dark:text-slate-100">
          Join our Global Community
        </h2>
        <p className="relative z-10 max-w-2xl p-2 mx-auto mt-3 text-lg text-center text-gray-600 mb-7 dark:text-slate-200">
          Be part of a vibrant, diverse network of remote professionals and
          forward-thinking companies. Discover opportunities, connect, and grow
          with us—wherever you are in the world.
        </p>
        {/* Trusted by logos */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 px-2 mb-8">
          <img
            src={typeof ravenzLogo === "string" ? ravenzLogo : ravenzLogo.src}
            alt="Ravenz"
            className="h-8 transition opacity-80 grayscale hover:grayscale-0"
          />
          <img
            src={
              typeof airfocusImg === "string" ? airfocusImg : airfocusImg.src
            }
            alt="Airfocus"
            className="object-cover w-8 h-8 transition rounded-full opacity-80 grayscale hover:grayscale-0"
          />
          <img
            src={typeof globexImg === "string" ? globexImg : globexImg.src}
            alt="Globex"
            className="object-cover w-8 h-8 transition rounded-full opacity-80 grayscale hover:grayscale-0"
          />
          <img
            src={typeof acmeImg === "string" ? acmeImg : acmeImg.src}
            alt="Acme"
            className="object-cover w-8 h-8 transition rounded-full opacity-80 grayscale hover:grayscale-0"
          />
          <span className="ml-2 text-sm font-medium text-gray-400">
            + hundreds more
          </span>
        </div>
        {/* World map illustration (SVG or image) with animated glow */}
        <div className="relative z-10 flex justify-center mb-8">
          <div className="relative flex items-center justify-center">
            {/* Animated pulse/glow */}
            <span
              className="absolute w-[90%] h-[90%] rounded-full bg-gradient-to-tr from-indigo-400/30 via-blue-400/20 to-purple-400/30 blur-2xl animate-pulse-glow"
              style={{ animationDuration: "2.5s" }}
            />
            <img
              src={worldMap}
              alt="World Map"
              loading="lazy"
              className="relative z-10 w-full max-w-2xl transition-all duration-700 border border-indigo-200 shadow-xl dark:border-slate-700 opacity-90 rounded-xl bg-white/30 dark:bg-slate-900/30 backdrop-blur animate-fade-in-right hover:scale-105 hover:shadow-2xl"
            />
          </div>
        </div>
        {/* Stats grid with glassmorphism cards, icons, and animated numbers */}
        <div
          ref={statsInViewRef}
          className="relative z-10 grid grid-cols-2 gap-4 p-4 md:grid-cols-4"
        >
          <div className="flex flex-col items-center p-6 text-center border border-indigo-100 shadow-lg rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur dark:border-slate-700">
            <Briefcase className="w-8 h-8 mb-2 text-indigo-600 dark:text-indigo-300" />
            <div className="text-3xl font-bold text-indigo-600">
              {jobsCount.toLocaleString()}+
            </div>
            <div className="font-serif text-lg font-extrabold text-gray-600 dark:text-slate-300 ">
              Remote Jobs
            </div>
          </div>
          <div className="flex flex-col items-center p-6 text-center border border-indigo-100 shadow-lg rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur dark:border-slate-700">
            <Building2 className="w-8 h-8 mb-2 text-indigo-600 dark:text-indigo-300" />
            <div className="text-3xl font-bold text-indigo-600">
              {companiesCount.toLocaleString()}+
            </div>
            <div className="font-serif text-lg font-extrabold text-gray-600 dark:text-slate-300 ">
              Companies
            </div>
          </div>
          <div className="flex flex-col items-center p-6 text-center border border-indigo-100 shadow-lg rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur dark:border-slate-700">
            <UserCircle className="w-8 h-8 mb-2 text-indigo-600 dark:text-indigo-300" />
            <div className="text-3xl font-bold text-indigo-600">
              {seekersCount.toLocaleString()}+
            </div>
            <div className="font-serif text-lg font-extrabold text-gray-600 dark:text-slate-300 ">
              Job Seekers
            </div>
          </div>
          <div className="flex flex-col items-center p-6 text-center border border-indigo-100 shadow-lg rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur dark:border-slate-700">
            <Globe className="w-8 h-8 mb-2 text-indigo-600 dark:text-indigo-300" />
            <div className="text-3xl font-bold text-indigo-600">
              {countriesCount.toLocaleString()}+
            </div>
            <div className="font-serif text-lg font-extrabold text-gray-600 dark:text-slate-300">
              Countries
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section - Styled like Join our Global Community */}
      <div className="relative py-12 mb-16 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 ">
        {/* Decorative blurred gradient blob */}
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10">
          <JobsCarousel />
        </div>
      </div>

      {/* Why Choose Us Section - Styled like Join our Global Community */}
      <div className="relative mb-16 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10 p-6">
          <img
            src={
              typeof reasonImage === "string" ? reasonImage : reasonImage.src
            }
            loading="lazy"
            alt="reason image"
            className="object-cover w-full h-full rounded-lg "
          />
        </div>
        <div className="relative z-10 mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-200 ">
            Why Choose Us
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600 dark:text-slate-100">
            We connect talented professionals with the best remote opportunities
            worldwide
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-1 gap-8 p-4 pb-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Review Section - Styled like Join our Global Community */}
      <div className="relative mb-16 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10 p-8">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="max-w-2xl mx-auto mb-6 text-lg text-center text-gray-600 dark:text-slate-300">
            Hear from our community of remote job seekers and employers about
            their experiences with Ravenz.
          </p>
          <Carousel
            opts={{ align: "center", loop: true }}
            setApi={setReviewApi}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full max-w-3xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {" "}
              {/* Increased negative margin */}
              {[
                {
                  name: "Alice Johnson",
                  image: reviewerImg1,
                  review:
                    "Ravenz helped me land my dream remote job! The process was smooth and the opportunities are real.",
                },
                {
                  name: "Damian Lee",
                  image: reviewerImg2,
                  review:
                    "I love the flexibility. The platform is easy to use and the support team is fantastic!",
                },
                {
                  name: "Carla Mendes",
                  image: reviewerImg3,
                  review:
                    "A great place to find legitimate remote work. I recommend it to all my friends.",
                },
                {
                  name: "David Kim",
                  image: reviewerImg4,
                  review:
                    "The variety of jobs is impressive. I found both part-time and full-time roles easily.",
                },
                {
                  name: "Juan Jahier",
                  image: reviewerImg4,
                  review:
                    "The variety of jobs is impressive. I found both part-time and full-time roles easily.",
                },
              ].map((reviewer, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-4 basis-full sm:basis-3/4 md:basis-1/2 lg:basis-2/5"
                >
                  {" "}
                  {/* Increased left padding */}
                  <div
                    className={`relative flex flex-col items-center justify-end w-full max-w-md 
                             transition-all duration-300 ease-in-out group bg-gray-900/80 shadow-xl overflow-hidden
                             rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl 
                             ${
                               reviewCurrentSlide === idx
                                 ? "min-h-[300px] h-[300px] sm:h-[340px] md:h-[380px] scale-100 opacity-100"
                                 : "min-h-[260px] h-[260px] sm:h-[300px] md:h-[340px] scale-90 opacity-70"
                             }`}
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url(${reviewer.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 transition-opacity group-hover:bg-black/40" />
                    <div className="relative z-10 flex flex-col items-center justify-end w-full h-full p-8 text-center text-white">
                      <div className="mb-4 text-xl font-bold drop-shadow-lg">
                        {reviewer.name}
                      </div>
                      <div className="max-w-xs mx-auto text-base font-medium opacity-90 drop-shadow">
                        “{reviewer.review}”
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: reviewSlideCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => reviewApi?.scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out
                  ${
                    reviewCurrentSlide === index
                      ? "bg-indigo-600 p-1"
                      : "bg-slate-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-400"
                  }`}
                aria-label={`Go to review slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section - Styled like Join our Global Community */}
      <div className="relative mb-16 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10 p-8">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-center text-gray-600 dark:text-slate-300">
            Getting started is easy! Follow these simple steps to join our
            community and land your next remote job. Whether you’re new to
            remote work or a seasoned pro, we’ll guide you every step of the
            way.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center p-6 transition-all bg-white shadow dark:bg-gray-800 rounded-xl hover:shadow-lg">
              <span className="inline-flex items-center justify-center mb-4 text-2xl text-indigo-600 bg-indigo-100 rounded-full w-14 h-14 dark:bg-indigo-900 dark:text-indigo-300">
                <ArrowRight className="w-8 h-8" />
              </span>
              <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Sign Up
              </h4>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Create your free account in seconds to get started.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 transition-all bg-white shadow dark:bg-gray-800 rounded-xl hover:shadow-lg">
              <span className="inline-flex items-center justify-center mb-4 text-2xl text-indigo-600 bg-indigo-100 rounded-full w-14 h-14 dark:bg-indigo-900 dark:text-indigo-300">
                <UserCircle className="w-8 h-8" />
              </span>
              <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Complete Profile
              </h4>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Fill in your details and upload your resume to stand out.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 transition-all bg-white shadow dark:bg-gray-800 rounded-xl hover:shadow-lg">
              <span className="inline-flex items-center justify-center mb-4 text-2xl text-indigo-600 bg-indigo-100 rounded-full w-14 h-14 dark:bg-indigo-900 dark:text-indigo-300">
                <Briefcase className="w-8 h-8" />
              </span>
              <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Browse & Apply
              </h4>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Explore jobs and apply to positions that match your skills.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 transition-all bg-white shadow dark:bg-gray-800 rounded-xl hover:shadow-lg">
              <span className="inline-flex items-center justify-center mb-4 text-2xl text-indigo-600 bg-indigo-100 rounded-full w-14 h-14 dark:bg-indigo-900 dark:text-indigo-300">
                <CheckCircle className="w-8 h-8" />
              </span>
              <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Get Hired
              </h4>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Land your dream remote job and start working from anywhere!
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white transition-colors bg-indigo-600 rounded shadow hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section - Styled like Join our Global Community */}
      <div className="relative grid items-center p-8 mb-16 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10 md:flex md:flex-row-reverse md:items-center md:justify-between">
          <div className="p-6 md:w-1/2">
            <img
              src={typeof startImage === "string" ? startImage : startImage.src}
              loading="lazy"
              alt="start with us image"
              className="object-cover w-full h-full rounded-lg shadow-md "
            />
          </div>
          <div className="text-center md:w-1/2 md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              Ready to start your remote journey?
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-slate-300">
              Join thousands of professionals who found their dream remote jobs.
            </p>
          </div>
        </div>
        <div className="relative z-10 w-1/3 mx-auto mt-6 rounded-full">
          <ActionButton to="/auth" variant="primary">
            Get Started Now
          </ActionButton>
        </div>
      </div>

      {/* Remote Work Insights / Career Tips Section */}
      <div className="relative mb-16 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <span className="absolute rounded-full pointer-events-none -top-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <span className="absolute rounded-full pointer-events-none -bottom-10 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-200 via-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-purple-900/20 blur-3xl opacity-60" />
        <div className="relative z-10 flex flex-col items-center justify-center p-8">
          <h2 className="mb-4 text-3xl font-bold text-center text-gray-900 dark:text-white">
            Remote Work Insights
          </h2>
          <p className="mb-6 text-lg text-center text-gray-600 dark:text-slate-300">
            Daily motivation and career tips to inspire your remote journey.
          </p>
        </div>
      </div>

      {/* Tailwind animation for pulse-glow */}
      {/* Add this to your global CSS if not present:
      @keyframes pulse-glow {
        0%,100%{opacity:.7;}
        50%{opacity:1;filter:blur(32px);}
      }
      .animate-pulse-glow {
        animation: pulse-glow 2.5s infinite;
      } */}
    </div>
  );
}
