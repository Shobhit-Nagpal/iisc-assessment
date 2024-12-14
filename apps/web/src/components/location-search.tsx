import { Dispatch, FormEvent, SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getGeoCodeData } from "@/utils/geocode";
import { BASE_URL } from "@/utils/api";

interface LocationSearchProps {
  onCoordinatesChange: Dispatch<SetStateAction<number[][]>>;
}

const locationSchema = z.object({
  origin: z.string().min(1, { message: "Input your origin location" }),
  destination: z
    .string()
    .min(1, { message: "Input your destination location" }),
});

type TFormSchema = z.infer<typeof locationSchema>;

export function LocationSearch({
  onCoordinatesChange,
}: LocationSearchProps) {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      origin: "",
      destination: "",
    },
  });

  async function onSubmit(values: TFormSchema) {
    const [originData, destData] = await Promise.all([
      getGeoCodeData(values.origin),
      getGeoCodeData(values.destination),
    ]);

    const res = await fetch(`${BASE_URL}/paths`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: {
          lon: originData[0].lon,
          lat: originData[0].lat,
        },
        destination: {
          lon: destData[0].lon,
          lat: destData[0].lat,
        },
      }),
    });

    const data = await res.json();
    console.log(data);
    onCoordinatesChange(data.path)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin</FormLabel>
              <FormControl>
                <Input placeholder="Enter origin location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <FormControl>
                <Input placeholder="Enter destination location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
