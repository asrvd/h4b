"use client";

import { CivicReport } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { DialogComponent } from "./ui/dialog";
import { useEffect, useState, useRef } from "react";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CivicReportTag } from "@prisma/client";
import useGeoLocation from "@/hooks/useGeoLocation";
import { toast } from "sonner";
import { createCivicReport } from "@/app/actions/main";
import { useFormStatus } from "react-dom";

const formSchema = z.object({
  message: z.string().min(1),

  title: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  isSpam: z.boolean().default(false),
  spamCount: z.number().default(0),
  upvotes: z.number().default(0),
  downvotes: z.number().default(0),
  tag: z.nativeEnum(CivicReportTag).default(CivicReportTag.OTHER),
});

export type CivicReportFormValues = z.infer<typeof formSchema>;

export function CreateCivicReportForm({
  showDialog,
  setShowDialog,
  userId,
}: {
  showDialog: boolean;
  setShowDialog: (value: boolean) => void;
  userId: string;
}) {
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      tag: CivicReportTag.OTHER,
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  const { latitude, longitude, error, requestLocation } = useGeoLocation();

  useEffect(() => {
    if (!latitude && !longitude && !error) {
      requestLocation();
    } else if (latitude && longitude) {
      form.setValue("latitude", latitude);
      form.setValue("longitude", longitude);
    }
  }, [latitude, longitude, requestLocation, error]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      const report = await createCivicReport(values, userId);

      console.log(report);
      form.reset();
      setPending(false);
      setShowDialog(false);
      toast.success("Report submitted successfully.");
    } catch (error) {
      form.reset();
      setPending(false);
      toast.error("An unknown error occurred.");
    }
  }

  return (
    <DialogComponent
      isOpen={showDialog}
      setIsOpen={setShowDialog}
      dialogTitle="Create a new civic report"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your report content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CivicReportTag).map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={pending}>
            {pending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </DialogComponent>
  );
}
