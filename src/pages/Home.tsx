import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building2, Globe, ArrowRight } from "lucide-react";
import heroImage from "../assets/images.png";
import reasonImage from "../assets/3718985.jpg";
import startImage from "../assets/3624001.jpg";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "../components/ui/carousel"; // Ensure this path is correct

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
  <div className="p-6 transition-all bg-white border border-gray-100 shadow-sm md:p-8 hover:shadow-md group">
    <div className="inline-flex items-center justify-center p-3 bg-indigo-50">
      {icon}
    </div>
    <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
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
      <p className="mb-4 text-lg text-center text-gray-600 dark:text-gray-800">
        Discover exciting remote job opportunities tailored for you. Explore a
        range of flexible job opportunities ranging from easy online tasks to
        full-time work in our clients’ offices.
      </p>
      <p className="mb-6 text-lg text-center text-gray-600 dark:text-gray-800">
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
                      to={`/jobDetails/${job.id}`}
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

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-slate-300">
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

      {/* Stats Section - Sharp edges */}
      <div className="py-4 mb-16 bg-white shadow-sm">
        {" "}
        <h2 className="mt-6 text-3xl font-bold text-center text-gray-700">
          Join our Global Community
        </h2>
        <p className="max-w-2xl p-5 mx-auto mt-5 mb-5 text-lg text-gray-600">
          Whether you’re a student, a stay-at-home parent, a professional, or a
          retiree, our global community embraces everyone, regardless of their
          background or abilities
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="p-4 text-center">
            <div className="text-3xl font-extrabold text-indigo-600">1,200+</div>
            <div className="font-serif text-xl font-extrabold text-gray-600">Remote Jobs</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-3xl font-extrabold text-indigo-600">500+</div>
            <div className="font-serif text-xl font-extrabold text-gray-600">Companies</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-3xl font-extrabold text-indigo-600">50k+</div>
            <div className="font-serif text-xl font-extrabold text-gray-600">Job Seekers</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-3xl font-extrabold text-indigo-600">40+</div>
            <div className="font-serif text-xl font-extrabold text-gray-600">Countries</div>
          </div>
        </div>
      </div>

      {/* Jobs Carousel Section */}
      <JobsCarousel />

      {/* Features Section - Sharp edges */}
      <div className="mb-16">
        <div className="p-6">
          <img
            src={
              typeof reasonImage === "string" ? reasonImage : reasonImage.src
            }
            loading="lazy"
            alt="reason image"
            className="object-cover w-full h-full rounded-lg "
          />
        </div>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
            We connect talented professionals with the best remote opportunities
            worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Review Section - Grid of reviewer cards with overlaid text */}
      <div className="mb-16">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/*
          {
            name: "Alice Johnson",
            image: require("../assets/airfocus-e-qQv7FBiPM-unsplash.jpg"),
            review:
              "Ravenz helped me land my dream remote job! The process was smooth and the opportunities are real.",
          },
          {
            name: "Brian Lee",
            image: require("../assets/pooria-shahriari-9l4pbq7fTbY-unsplash.jpg"),
            review:
              "I love the flexibility. The platform is easy to use and the support team is fantastic!",
          },
          {
            name: "Carla Mendes",
            image: require("../assets/corinne-kutz-eeqFjT6q_sQ-unsplash.jpg"),
            review:
              "A great place to find legitimate remote work. I recommend it to all my friends.",
          },
          {
            name: "David Kim",
            image: require("../assets/pooria-shahriari-YtmDrGPuCcU-unsplash.jpg"),
            review:
              "The variety of jobs is impressive. I found both part-time and full-time roles easily.",
          },
        */}
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="relative flex items-end h-64 overflow-hidden rounded-lg shadow group"
              style={{
                backgroundImage: `url(https://source.unsplash.com/random?sig=${idx})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 transition-opacity bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80" />
              <div className="relative z-10 w-full p-6 text-white">
                <div className="mb-2 text-lg font-semibold">Reviewer Name</div>
                <div className="text-sm opacity-90">
                  “This is a sample review text for the reviewer card. It gives
                  an idea about the reviewer's experience."
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section - Sharp edges */}
      <div className="grid items-center p-8 mb-16 bg-gray-50">
        <div className=" md:flex md:flex-row-reverse md:items-center md:justify-between">
          <div className="p-6 md:w-1/2">
            <img
              src={typeof startImage === "string" ? startImage : startImage.src}
              loading="lazy"
              alt="start with us image"
              className="object-cover w-full h-full rounded-lg shadow-md "
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Ready to start your remote journey?
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Join thousands of professionals who found their dream remote jobs.
            </p>
          </div>
          <div className="mt-4 md:mt-0"></div>
        </div>
      </div>
    </div>
  );
}
