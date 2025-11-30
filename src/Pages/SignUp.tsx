/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { z } from "zod";

import { logo } from "@/assets";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from "@/components/ui";
import GlobalDropdown from "@/components/ui/GlobalDropdown";
import axiosInstance from "@/redux/utils/axiosInstance";

const SignUpSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Phone is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  gender: z.enum(["female", "male", "non_binary", "unspecified"], {
    required_error: "Please select a gender",
  }),
  date_of_birth: z.string().min(4, "Date of birth is required"),
});

type SignUpValues = z.infer<typeof SignUpSchema>;

interface CountryOption {
  text: string;
  value: string;
}

interface CityOption {
  text: string;
  value: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [countryPhoneCode, setCountryPhoneCode] = useState<string>("");
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [detectedCityName, setDetectedCityName] = useState<string>("");

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      gender: "unspecified",
      date_of_birth: "",
    },
  });

  const selectedCountry = form.watch("country");

  // Get user location and auto-select country/city
  useEffect(() => {
    if (countryOptions.length === 0 || locationDetected || selectedCountry) {
      return; // Don't auto-detect if already selected or countries not loaded
    }

    const detectLocation = async () => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
              {
                headers: {
                  "User-Agent": "PageChat/1.0", // Required by Nominatim
                },
              }
            );

            const data = await response.json();
            const address = data.address;

            if (address) {
              // Get country code (ISO 3166-1 alpha-2)
              const countryCode = address.country_code?.toUpperCase();
              const cityName =
                address.city ||
                address.town ||
                address.village ||
                address.municipality;

              if (countryCode) {
                // Find matching country in our options
                const matchedCountry = countryOptions.find(
                  (opt) => opt.value === countryCode
                );

                if (matchedCountry) {
                  // Auto-select country
                  form.setValue("country", countryCode);
                  setLocationDetected(true);

                  // Store city name for later matching (will be used when cities load)
                  if (cityName) {
                    setDetectedCityName(cityName);
                  }
                }
              }
            }
          } catch (error) {
            console.error("Failed to reverse geocode location:", error);
          }
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          // Silently fail - user can manually select
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    };

    detectLocation();
  }, [countryOptions, locationDetected, selectedCountry, form]);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await axiosInstance.get<{
          data: Array<{
            id: string;
            attributes: {
              name: string;
              code: string;
              phone_code: string;
            };
          }>;
        }>("/countries");
        const options: CountryOption[] =
          response.data.data?.map((item) => ({
            text: item.attributes.name,
            value: item.attributes.code,
          })) || [];
        setCountryOptions(options);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        toast({
          title: "Error",
          description: "Failed to load countries. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setCityOptions([]);
      form.setValue("city", "");
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await axiosInstance.get<{
          data: Array<{
            id: string;
            attributes: {
              name: string;
              state_province?: string;
            };
          }>;
        }>(`/cities?country_code=${selectedCountry}`);
        const options: CityOption[] =
          response.data.data?.map((item) => ({
            text: item.attributes.state_province
              ? `${item.attributes.name}, ${item.attributes.state_province}`
              : item.attributes.name,
            value: item.id,
          })) || [];
        setCityOptions(options);

        // Try to auto-select city if we detected one and cities are now loaded
        if (detectedCityName && options.length > 0) {
          const matchedCity = options.find((city) => {
            const detectedNameLower = detectedCityName.toLowerCase();
            const cityTextLower = city.text.toLowerCase();
            return (
              cityTextLower === detectedNameLower ||
              cityTextLower.includes(detectedNameLower) ||
              detectedNameLower.includes(cityTextLower.split(",")[0].trim())
            );
          });

          if (matchedCity) {
            form.setValue("city", matchedCity.value);
            setDetectedCityName(""); // Clear after matching
          }
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        toast({
          title: "Error",
          description: "Failed to load cities. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedCountry, form, detectedCityName]);

  // Fetch country phone code when country changes
  useEffect(() => {
    if (selectedCountry) {
      setSelectedCountryCode(selectedCountry);
      const fetchCountryDetails = async () => {
        try {
          const response = await axiosInstance.get<{
            data: {
              id: string;
              attributes: {
                name: string;
                code: string;
                phone_code: string;
              };
            };
          }>(`/countries/${selectedCountry}`);
          setCountryPhoneCode(response.data.data.attributes.phone_code || "");
        } catch (error) {
          console.error("Failed to fetch country details:", error);
        }
      };
      fetchCountryDetails();
    } else {
      setSelectedCountryCode("");
      setCountryPhoneCode("");
    }
  }, [selectedCountry]);

  const onSubmit = async (values: SignUpValues) => {
    try {
      await axiosInstance.post("/signup", {
        user: {
          ...values,
          country_code: values.country, // country is already the code from GlobalDropdown
          city_id: values.city,
        },
      });

      toast({
        title: "Account created",
        description:
          "Please check your email to activate your account and choose a password.",
        variant: "success",
      });
      navigate("/signin");
    } catch (error: unknown) {
      toast({
        title: "Unable to create account",
        description:
          "We couldn't complete your registration. Please review your details and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefaf5] via-white to-[#f3f0ff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-[32px] bg-white shadow-[0_30px_120px_rgba(34,34,34,0.12)] border border-white/40 px-8 py-10 space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src={logo}
            alt="Page Chat logo"
            className="w-20 h-20 rounded-full bg-white shadow-md"
          />
          <p className="text-xs font-semibold tracking-[0.4em] text-downy-dark uppercase">
            Join the community
          </p>
          <h1 className="text-3xl font-semibold text-charcoal">
            Create your Page Chat account
          </h1>
          <p className="text-sm text-charcoal/70 max-w-xl">
            Share a few details so we can connect you with the right shelves,
            clubs, and conversations. You&apos;ll receive an email to activate
            your account and set a secure password.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      {selectedCountryCode && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                          <img
                            src={`https://flagsapi.com/${selectedCountryCode}/flat/64.png`}
                            alt="Country flag"
                            className="w-6 h-4 object-cover rounded"
                          />
                          {countryPhoneCode && (
                            <span className="text-sm text-charcoal/70">
                              {countryPhoneCode}
                            </span>
                          )}
                        </div>
                      )}
                      <Input
                        placeholder={
                          countryPhoneCode
                            ? `${countryPhoneCode} ...`
                            : "+255..."
                        }
                        className={`h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20 ${
                          selectedCountryCode ? "pl-24" : ""
                        }`}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Country
                  </FormLabel>
                  <FormControl>
                    <div className="[&_select]:h-12 [&_select]:rounded-2xl [&_select]:border [&_select]:border-[#efe6da] [&_select]:bg-white/90 [&_select]:px-4 [&_select]:text-charcoal [&_select]:focus:border-downy [&_select]:focus:ring-downy/20 [&_select]:focus:outline-none [&_label]:text-sm [&_label]:font-medium [&_label]:text-charcoal [&_.appearance-none]:h-12 [&_.appearance-none]:rounded-2xl [&_.appearance-none]:border [&_.appearance-none]:border-[#efe6da] [&_.appearance-none]:bg-white/90 [&_.appearance-none]:px-4 [&_.appearance-none]:text-charcoal [&_.appearance-none]:focus:border-downy [&_.appearance-none]:focus:ring-downy/20">
                      <GlobalDropdown
                        options={countryOptions}
                        name="country"
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          form.setValue("city", ""); // Reset city when country changes
                        }}
                        placeholder="Select country"
                        required
                        searchable
                        isLoading={loadingCountries}
                        className="w-full"
                        error={form.formState.errors.country?.message}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    City
                  </FormLabel>
                  <FormControl>
                    <div className="[&_select]:h-12 [&_select]:rounded-2xl [&_select]:border [&_select]:border-[#efe6da] [&_select]:bg-white/90 [&_select]:px-4 [&_select]:text-charcoal [&_select]:focus:border-downy [&_select]:focus:ring-downy/20 [&_select]:focus:outline-none [&_label]:text-sm [&_label]:font-medium [&_label]:text-charcoal [&_.appearance-none]:h-12 [&_.appearance-none]:rounded-2xl [&_.appearance-none]:border [&_.appearance-none]:border-[#efe6da] [&_.appearance-none]:bg-white/90 [&_.appearance-none]:px-4 [&_.appearance-none]:text-charcoal [&_.appearance-none]:focus:border-downy [&_.appearance-none]:focus:ring-downy/20">
                      <GlobalDropdown
                        options={cityOptions}
                        name="city"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          !selectedCountry
                            ? "Select country first"
                            : loadingCities
                            ? "Loading cities..."
                            : "Select city"
                        }
                        required
                        disabled={!selectedCountry}
                        searchable
                        isLoading={loadingCities}
                        className="w-full"
                        error={form.formState.errors.city?.message}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street, area"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Gender
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="h-12 w-full rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal focus:border-downy focus:ring-downy/20 focus:outline-none"
                    >
                      <option value="unspecified">Select gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non_binary">Non-binary</option>
                      <option value="unspecified">Prefer not to say</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">
                    Date of birth
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2 flex flex-col gap-3 mt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 rounded-full bg-downy text-white font-semibold tracking-wide shadow-lg shadow-downy/30 transition hover:bg-downy-dark"
              >
                {form.formState.isSubmitting
                  ? "Creating account..."
                  : "Create account"}
              </Button>
              <p className="text-xs text-center text-charcoal/60">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-medium text-downy hover:text-downy-dark"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
