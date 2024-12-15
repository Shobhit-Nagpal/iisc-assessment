import { Dispatch, SetStateAction } from "react";
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
import { Loader, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPath } from "@/utils/coordinates";
import { useToast } from "@/hooks/use-toast";

interface LocationSearchProps {
  origin: [number, number] | null;
  destination: [number, number] | null;
  loading: boolean;
  onLoading: Dispatch<SetStateAction<boolean>>;
  onModeChange: Dispatch<SetStateAction<"click" | "input">>;
  onCoordinatesChange: Dispatch<SetStateAction<number[][]>>;
  onAltCoordinatesChange: Dispatch<SetStateAction<number[][][]>>;
  onOriginChange: Dispatch<SetStateAction<[number, number] | null>>;
  onDestinationChange: Dispatch<SetStateAction<[number, number] | null>>;
}

const locationSchema = z.object({
  origin: z.string().min(1, { message: "Input your origin location" }),
  destination: z
    .string()
    .min(1, { message: "Input your destination location" }),
});

type TFormSchema = z.infer<typeof locationSchema>;

export function LocationSearch({
  origin,
  destination,
  onModeChange,
  loading,
  onLoading,
  onCoordinatesChange,
  onAltCoordinatesChange,
  onOriginChange,
  onDestinationChange
}: LocationSearchProps) {
  const { toast } = useToast();
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
    onAltCoordinatesChange([]);
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
        toast({
          title: "No paths found",
          variant: "destructive",
        });
        return;
      }

      const shortestPath = allPaths.shift();
      onCoordinatesChange(shortestPath);
      onAltCoordinatesChange(allPaths);
      onOriginChange(null)
      onDestinationChange(null)
    } catch (err) {
      const error = err as Error;
      toast({
        title: error.message,
        variant: "destructive",
      });
    } finally {
      onLoading(false);
    }
  }

  return (
    <MaxWidthWrapper className="my-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="input"
            onClick={() => onModeChange("input")}
            className="w-full"
          >
            Input
          </TabsTrigger>
          <TabsTrigger
            value="click"
            onClick={() => onModeChange("click")}
            className="w-full"
          >
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <h3 className="font-medium">Origin</h3>
                </div>
                {origin ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Latitude: {origin[0].toFixed(6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Longitude: {origin[1].toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Click on map to set origin point
                  </p>
                )}
              </div>

              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <h3 className="font-medium">Destination</h3>
                </div>
                {destination ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Latitude: {destination[0].toFixed(6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Longitude: {destination[1].toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Click on map to set destination point
                  </p>
                )}
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Calculating route...</span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
}
