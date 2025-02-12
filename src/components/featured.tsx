const logos = [
    "techcrunch.com",
    "businessinsider.com",
    "yahoo.com",
    "producthunt.com",
    "hrtech.com",
    "techdayhq.com",
    "techrepublic.com",
  ];
  
  const FeaturedIn = () => {
    return (
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">Featured in</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {logos.map((domain) => (
              <img
                key={domain}
                src={`https://logo.clearbit.com/${domain}`}
                alt={domain}
                className="h-8"
              />
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default FeaturedIn;
  