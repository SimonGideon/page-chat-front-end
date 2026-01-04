import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { getCurrentUser, setUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axiosInstance from "@/redux/utils/axiosInstance";

const ProfileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  gender: z.enum(["male", "female", "other"]),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  country_code: z.string().min(1, "Country is required"),
  city_id: z.string().min(1, "City is required"),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

interface DropdownOption {
  value: string;
  text: string;
}

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdown states
  const [countryOptions, setCountryOptions] = useState<DropdownOption[]>([]);
  const [cityOptions, setCityOptions] = useState<DropdownOption[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [countryPhoneCode, setCountryPhoneCode] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      gender: "male",
      date_of_birth: "",
      country_code: "",
      city_id: "",
    },
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone?.toString() || "",
        address: user.address || "",
        gender: (user.gender as "male" | "female" | "other") || "male",
        date_of_birth: user.date_of_birth
          ? new Date(user.date_of_birth).toISOString().split("T")[0]
          : "",
        country_code: user.country_code || "",
        city_id: user.city_id || "",
      });
      setSelectedCountryCode(user.country_code || "");
      if (user.avatar_url) {
        setAvatarPreview(user.avatar_url);
      }
    }
  }, [user, form]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await axiosInstance.get<{
          data: Array<{
            id: string;
            attributes: {
              name: string;
              code: string;
            };
          }>;
        }>("/countries");
        const options: DropdownOption[] =
          response.data.data?.map((item) => ({
            text: item.attributes.name,
            value: item.attributes.code,
          })) || [];
        setCountryOptions(options);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load countries",
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
    if (!selectedCountryCode) {
      setCityOptions([]);
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
        }>(`/cities?country_code=${selectedCountryCode}`);
        const options: DropdownOption[] =
          response.data.data?.map((item) => ({
            text: item.attributes.state_province
              ? `${item.attributes.name}, ${item.attributes.state_province}`
              : item.attributes.name,
            value: item.id,
          })) || [];
        setCityOptions(options);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load cities",
          variant: "destructive",
        });
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedCountryCode]);

  // Fetch country phone code when country changes
  useEffect(() => {
    if (selectedCountryCode) {
      const fetchPhoneCode = async () => {
        try {
          const response = await axiosInstance.get<{
            data: {
              attributes: {
                phone_code: string;
              };
            };
          }>(`/countries/${selectedCountryCode}`);
          setCountryPhoneCode(response.data.data?.attributes?.phone_code || "");
        } catch {
          setCountryPhoneCode("");
        }
      };
      fetchPhoneCode();
    } else {
      setCountryPhoneCode("");
    }
  }, [selectedCountryCode]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("user[first_name]", data.first_name);
      formData.append("user[last_name]", data.last_name);
      formData.append("user[phone]", data.phone);
      formData.append("user[address]", data.address);
      formData.append("user[gender]", data.gender);
      formData.append("user[date_of_birth]", data.date_of_birth);
      formData.append("user[country_code]", data.country_code);
      formData.append("user[city_id]", data.city_id);

      if (avatarFile) {
        formData.append("user[avatar]", avatarFile);
      }

      const response = await axiosInstance.patch<{ data: any }>(`/users/${user?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update user data immediately with the response from the server
      if (response.data && response.data.data) {
          dispatch(setUser(response.data.data)); // The response is already serialized attributes
      } else {
          // Fallback if structure differs, though controller returns { data: attributes }
          dispatch(getCurrentUser());
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative">
          <div
            onClick={handleAvatarClick}
            className="cursor-pointer relative group"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl sm:text-2xl font-semibold">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            {user?.first_name} {user?.last_name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 break-all">
            {user?.email}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Click on avatar to change
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      {selectedCountryCode && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                          <img
                            src={`https://flagsapi.com/${selectedCountryCode}/flat/64.png`}
                            alt="Country flag"
                            className="w-6 h-4 object-cover rounded"
                          />
                          {countryPhoneCode && (
                            <span className="text-sm text-gray-500">
                              {countryPhoneCode}
                            </span>
                          )}
                        </div>
                      )}
                      <Input
                        placeholder={
                          countryPhoneCode
                            ? `${countryPhoneCode} ...`
                            : "+254..."
                        }
                        className={selectedCountryCode ? "pl-24" : ""}
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
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-[8px] border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <GlobalDropdown
                      name="country_code"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value as string);
                        setSelectedCountryCode(value as string);
                        form.setValue("city_id", "");
                      }}
                      placeholder="Select country"
                      options={countryOptions}
                      isLoading={loadingCountries}
                      searchable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <GlobalDropdown
                      name="city_id"
                      value={field.value}
                      onChange={(value) => field.onChange(value as string)}
                      placeholder="Select city"
                      options={cityOptions}
                      isLoading={loadingCities}
                      disabled={!selectedCountryCode}
                      searchable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center sm:justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-downy hover:bg-downy-dark text-white px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
