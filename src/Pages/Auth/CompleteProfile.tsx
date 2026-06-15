import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/authSlice";

const ProfileSchema = z.object({
  phone:        z.string().min(6, "Phone number is required"),
  address:      z.string().min(3, "Address is required"),
  country:      z.string().min(1, "Country is required"),
  city:         z.string().min(1, "City is required"),
  gender:       z.enum(["female", "male", "non_binary", "unspecified"], {
                  required_error: "Please select a gender",
                }),
  date_of_birth: z.string().min(4, "Date of birth is required"),
});

type ProfileValues = z.infer<typeof ProfileSchema>;

interface CountryOption { text: string; value: string; }
interface CityOption    { text: string; value: string; }

const CompleteProfile = () => {
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();
  const { user }   = useAppSelector((state) => state.auth);

  const [countryOptions,    setCountryOptions]    = useState<CountryOption[]>([]);
  const [cityOptions,       setCityOptions]       = useState<CityOption[]>([]);
  const [loadingCountries,  setLoadingCountries]  = useState(true);
  const [loadingCities,     setLoadingCities]     = useState(false);
  const [countryPhoneCode,  setCountryPhoneCode]  = useState("");

  const form = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      phone:         "",
      address:       "",
      country:       "",
      city:          "",
      gender:        "unspecified",
      date_of_birth: "",
    },
  });

  const selectedCountry = form.watch("country");

  // ── Fetch countries ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingCountries(true);
        const res = await axiosInstance.get<{
          data: Array<{ id: string; attributes: { name: string; code: string; phone_code: string } }>;
        }>("/countries");
        setCountryOptions(
          res.data.data?.map((item) => ({
            text:  item.attributes.name,
            value: item.attributes.code,
          })) ?? []
        );
      } catch {
        toast({ title: "Error", description: "Failed to load countries.", variant: "destructive" });
      } finally {
        setLoadingCountries(false);
      }
    };
    fetch();
  }, []);

  // ── Fetch cities when country changes ────────────────────────────────────
  useEffect(() => {
    if (!selectedCountry) { setCityOptions([]); form.setValue("city", ""); return; }

    const fetch = async () => {
      setLoadingCities(true);
      try {
        const res = await axiosInstance.get<{
          data: Array<{ id: string; attributes: { name: string } }>;
        }>(`/countries/${selectedCountry}/cities`);
        setCityOptions(
          res.data.data?.map((item) => ({
            text:  item.attributes.name,
            value: item.id,
          })) ?? []
        );

        // Set phone code for the selected country
        const countryRes = await axiosInstance.get<{
          data: { attributes: { phone_code: string } };
        }>(`/countries/${selectedCountry}`);
        setCountryPhoneCode(countryRes.data.data?.attributes?.phone_code ?? "");
      } catch {
        // Silently fail
      } finally {
        setLoadingCities(false);
      }
    };
    fetch();
  }, [selectedCountry]);  // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: ProfileValues) => {
    if (!user?.id) return;
    try {
      const res = await axiosInstance.patch<{
        status: { code: number; message: string };
        data: typeof user;
      }>(`/users/${user.id}`, {
        user: {
          phone:         data.phone,
          address:       data.address,
          country_code:  data.country,
          city_id:       data.city,
          gender:        data.gender,
          date_of_birth: data.date_of_birth,
        },
      });

      dispatch(setUser(res.data.data));
      toast({ title: "Profile saved!", variant: "success", description: "Welcome to Page Chat." });
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { status?: { message?: string } } } })
          ?.response?.data?.status?.message ?? "Failed to save profile.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefaf5] via-white to-[#f3f0ff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[32px] bg-white shadow-[0_30px_120px_rgba(34,34,34,0.12)] border border-white/40 px-8 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="Page Chat" className="w-16 h-16 rounded-full bg-white shadow-md" />
          <div className="inline-flex items-center gap-2 rounded-full bg-downy-lightest px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-downy-dark">
            Almost there
          </div>
          <h1 className="text-2xl font-semibold text-charcoal">
            Complete your profile, {user?.first_name}
          </h1>
          <p className="text-sm text-charcoal/70 max-w-md">
            You signed in with Google. Add a few more details so we can connect you
            with the right shelves, clubs, and conversations.
          </p>
        </div>

        {/* Skip link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard", { replace: true })}
            className="text-sm text-charcoal/50 hover:text-downy underline underline-offset-2"
          >
            Skip for now — I'll complete it later
          </button>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">Phone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      {countryPhoneCode && (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-charcoal/60 pointer-events-none z-10">
                          {countryPhoneCode}
                        </span>
                      )}
                      <Input
                        placeholder="+255..."
                        className={`h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20 ${countryPhoneCode ? "pl-16" : ""}`}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal placeholder:text-charcoal/50 focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">Country</FormLabel>
                  <FormControl>
                    <GlobalDropdown
                      options={countryOptions}
                      name="country"
                      placeholder={loadingCountries ? "Loading…" : "Select country"}
                      onChange={(v) => field.onChange(v)}
                      value={field.value}
                      searchable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">City</FormLabel>
                  <FormControl>
                    <GlobalDropdown
                      options={cityOptions}
                      name="city"
                      placeholder={
                        !selectedCountry ? "Select country first" :
                        loadingCities   ? "Loading cities…"      : "Select city"
                      }
                      onChange={(v) => field.onChange(v)}
                      value={field.value}
                      searchable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">Gender</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="h-12 w-full rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal focus:border-downy focus:ring-downy/20 focus:outline-none"
                    >
                      <option value="unspecified">Prefer not to say</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non_binary">Non-binary</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of birth */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">Date of birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-12 rounded-2xl border border-[#efe6da] bg-white/90 px-4 text-charcoal focus:border-downy focus:ring-downy/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="md:col-span-2 mt-2">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 rounded-full bg-downy text-white font-semibold tracking-wide shadow-lg shadow-downy/30 transition hover:bg-downy-dark"
              >
                {form.formState.isSubmitting ? "Saving…" : "Save & continue to dashboard"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompleteProfile;
