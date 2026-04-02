import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import {
  Controller,
  type FieldError,
  type Resolver,
  type SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  contactBannerSchema,
  type ContactBannerFormData,
} from "@/schemas/contact-banner-schema";
import { cn } from "@/lib/utils";

export const FormBanner: FC = () => {
  const contactResolver: Resolver<ContactBannerFormData> = async (values) => {
    const parsed = contactBannerSchema.safeParse(values);
    if (parsed.success) {
      return { values: parsed.data, errors: {} };
    }

    const firstIssue = parsed.error.issues[0];
    if (!firstIssue) {
      return { values: {}, errors: {} };
    }

    const path = firstIssue.path[0];
    if (typeof path !== "string") {
      return { values: {}, errors: {} };
    }

    return {
      values: {},
      errors: {
        [path]: {
          type: firstIssue.code,
          message: firstIssue.message,
        },
      } as Record<string, FieldError>,
    };
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactBannerFormData>({
    resolver: contactResolver,
    defaultValues: {
      name: "",
      phone: "",
      accepted: false,
    },
  });

  const accepted = watch("accepted");
  const fieldHasError = (field: keyof ContactBannerFormData) =>
    Boolean(errors[field]);
  const withErrorStyles = (field: keyof ContactBannerFormData) =>
    fieldHasError(field)
      ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
      : undefined;

  const onSubmitError: SubmitErrorHandler<ContactBannerFormData> = (
    formErrors,
  ) => {
    const firstMessage =
      formErrors.name?.message ??
      formErrors.phone?.message ??
      formErrors.accepted?.message ??
      "Проверьте корректность данных";

    if (firstMessage) {
      toast.error(firstMessage);
    }
  };

  const onSubmit = handleSubmit((data) => {
    toast.success(
      `Спасибо ${data.name} ! Мы свяжемся с вами в ближайшее время.`,
    );
    reset({ name: "", phone: "", accepted: false });
  }, onSubmitError);

  return (
    <form onSubmit={onSubmit} className="max-w-[450px] gap-4 m-auto grid mt-6">
      <div className="grid md:flex gap-2 text-black">
        <Input
          {...register("name")}
          placeholder="Имя"
          aria-invalid={fieldHasError("name")}
          className={cn("bg-whiteSecondary h-[40px]", withErrorStyles("name"))}
        />
        <Input
          {...register("phone")}
          placeholder="Номер телефона"
          inputMode="tel"
          type="tel"
          aria-invalid={fieldHasError("phone")}
          className={cn("bg-whiteSecondary h-[40px]", withErrorStyles("phone"))}
        />
      </div>

      <div className="flex items-center justify-start gap-2 text-greySecondary">
        <Controller
          name="accepted"
          control={control}
          render={({ field }) => (
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              className={cn(
                "mt-0.5",
                fieldHasError("accepted") && "ring-1 ring-red-400",
              )}
            />
          )}
        />
        <p className="text-[12px] leading-snug block text-left">
          Ознакомьтесь с{" "}
          <Link
            href={"/privacy"}
            className="text-yellow-hover hover:opacity-80 md:text-left md:inline-block"
          >
            политикой конфиденциальности.
          </Link>
        </p>
      </div>

      <Button
        type="submit"
        disabled={!accepted || isSubmitting}
        className="bg-yellowPrimary text-colorPrimary font-bold w-full py-6 disabled:opacity-50 disabled:cursor-not-allowed"
        variant="default"
      >
        Связаться с нами
      </Button>
      <p className="text-whitePrimary text-sm ">
        Обычно мы перезваниваем в течение 15 минут
      </p>
    </form>
  );
};
