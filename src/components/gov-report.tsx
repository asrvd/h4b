"use client";

import { GovernmentReport, GovernmentReportCategory } from "@prisma/client";
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
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormStatus } from "react-dom";
import { createGovernmentReport } from "@/app/actions/main";
import { toast } from "sonner";
import { useRef } from "react";

const formSchema = z.object({
  message: z.string().min(1),
  officeLocation: z.string().min(1),
  officeName: z.string().min(1),
  officialName: z.string().optional(),
  category: z
    .nativeEnum(GovernmentReportCategory)
    .default(GovernmentReportCategory.OTHER),
  anonymous: z.boolean().default(true),
  title: z.string().min(1),
});

export type GovernmentReportFormValues = z.infer<typeof formSchema>;

export function CreateGovernmentReportForm({
  showDialog,
  setShowDialog,
  userId,
}: {
  showDialog: boolean;
  setShowDialog: (value: boolean) => void;
  userId: string;
}) {
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      officeLocation: "",
      officeName: "",
      officialName: "",
      category: GovernmentReportCategory.OTHER,
      anonymous: true,
      title: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      const report = await createGovernmentReport(values, userId);

      console.log(report);
      // clear form
      form.reset();
      setPending(false);
      setShowDialog(false);
      toast.success("Report submitted successfully.");
    } catch (error) {
      form.reset()
      setPending(false);
      toast.error("An unknown error occurred.");
    }
  }

  return (
    <DialogComponent
      isOpen={showDialog}
      setIsOpen={setShowDialog}
      dialogTitle="Create a new government report"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2" ref={formRef}>
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
            name="officeLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the office location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="officeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the office name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="officialName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Official Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the official name (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(GovernmentReportCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Post Anonymously</FormLabel>
                </div>
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
          <Button type="submit" disabled={pending}>
            {pending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </DialogComponent>
  );
}
