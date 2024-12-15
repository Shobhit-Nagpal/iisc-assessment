import { Dispatch, SetStateAction, useState } from "react";
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
import { MaxWidthWrapper } from "./max-width-wrapper";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPath } from "@/utils/coordinates";

interface LocationSearchProps {
  path: number[][];
  loading: boolean;
  onLoading: Dispatch<SetStateAction<boolean>>;
  onModeChange: Dispatch<SetStateAction<"click" | "input">>;
  onCoordinatesChange: Dispatch<SetStateAction<number[][]>>;
  onAltCoordinatesChange: Dispatch<SetStateAction<number[][][]>>;
}

const locationSchema = z.object({
  origin: z.string().min(1, { message: "Input your origin location" }),
  destination: z
    .string()
    .min(1, { message: "Input your destination location" }),
});

type TFormSchema = z.infer<typeof locationSchema>;

export function LocationSearch({
  path,
  onModeChange,
  loading,
  onLoading,
  onCoordinatesChange,
  onAltCoordinatesChange,
}: LocationSearchProps) {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      origin: "",
      destination: "",
    },
  });

  async function reset() {
    form.reset(form.formState.defaultValues, {
      keepErrors: false,
      keepDefaultValues: true,
    });
    onCoordinatesChange([]);
  }

  async function onSubmit(values: TFormSchema) {
    try {
      onLoading(true);
      const [originData, destData] = await Promise.all([
        getGeoCodeData(values.origin),
        getGeoCodeData(values.destination),
      ]);

      const data = await getPath(originData[0], destData[0]);
      const allPaths = data.paths;

      if (allPaths.length === 0) {
        //Show toast here
        console.log("No paths found");
        return;
      }

      const shortestPath = allPaths.shift();
      onCoordinatesChange(shortestPath);
      onAltCoordinatesChange(allPaths);
    } catch (err) {
    } finally {
      onLoading(false);
    }
  }

  return (
    <MaxWidthWrapper className="my-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md">
      <Tabs defaultValue="input" className="w-full">
        <TabsList>
          <TabsTrigger value="input" onClick={() => onModeChange("input")}>
            Input
          </TabsTrigger>
          <TabsTrigger value="click" onClick={() => onModeChange("click")}>
            Click
          </TabsTrigger>
        </TabsList>
        <TabsContent value="input">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input
                          placeholder="Enter destination location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-center gap-3 mt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Calculating...
                    </span>
                  ) : (
                    "Find route"
                  )}
                </Button>
                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => reset()}
                  variant="outline"
                  className="min-w-[120px]"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="click">
          <div>
            <h2>Lat: {path[0]}</h2>
            <h2>Long: {path[0]}</h2>
            {loading ? "Calculating..." : null}
          </div>
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
}
