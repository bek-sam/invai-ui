import { CreditCard, Home, Package, Settings } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  BigButton,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChannelBadge,
  Checkbox,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ConfidenceBadge,
  DataTable,
  type DataTableColumn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  FileDrop,
  Input,
  Kbd,
  Label,
  Money,
  PageHeader,
  PinPad,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  RelativeTime,
  ScanResult,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ShipByBadge,
  Skeleton,
  StatCard,
  StationHeader,
  StatusBadge,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  toast,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../src/index";
import { ORDER_ITEM_STATES, CHANNELS, CONFIDENCE_BANDS } from "@invai/contracts";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-b border-border pb-10">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

interface DemoRow {
  id: string;
  order: string;
  channel: (typeof CHANNELS)[number];
  total: number;
  shipBy: string;
}

const rows: DemoRow[] = Array.from({ length: 200 }).map((_, i) => ({
  id: `row-${i}`,
  order: `#${1000 + i}`,
  channel: CHANNELS[i % CHANNELS.length]!,
  total: 1200 + i * 37,
  shipBy: new Date(Date.now() + (i % 5 === 0 ? -1 : 1) * (i % 48) * 3_600_000).toISOString(),
}));

const columns: DataTableColumn<DemoRow, unknown>[] = [
  { id: "order", header: "Order", accessorKey: "order" },
  {
    id: "channel",
    header: "Channel",
    accessorKey: "channel",
    cell: ({ getValue }) => <ChannelBadge channel={getValue() as DemoRow["channel"]} />,
  },
  {
    id: "total",
    header: "Total",
    accessorKey: "total",
    cell: ({ getValue }) => <Money cents={getValue() as number} />,
  },
  {
    id: "shipBy",
    header: "Ship by",
    accessorKey: "shipBy",
    cell: ({ getValue }) => <ShipByBadge shipBy={getValue() as string} />,
  },
];

export function App() {
  const [dark, setDark] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [scan, setScan] = useState<"ok" | "blocked" | null>(null);

  return (
    <TooltipProvider>
      <div className={dark ? "dark" : ""}>
        <div className="min-h-screen bg-background p-8 text-foreground">
          <div className="mx-auto flex max-w-5xl flex-col gap-10">
            <PageHeader
              title="@invai/ui playground"
              description="Every component, one page, for a quick visual check."
              actions={
                <>
                  <Button variant="outline" onClick={() => setDark((d) => !d)}>
                    Toggle dark mode
                  </Button>
                  <Button onClick={() => toast.success("Toast works")}>Fire a toast</Button>
                </>
              }
            />

            <Section title="Buttons">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="success">Success</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">XL</Button>
              <BigButton icon={Package}>Floor (huge)</BigButton>
            </Section>

            <Section title="Form controls">
              <div className="flex w-64 flex-col gap-2">
                <Label htmlFor="pg-input">Design name</Label>
                <Input id="pg-input" placeholder="Desert Sunset" />
              </div>
              <div className="flex w-64 flex-col gap-2">
                <Label htmlFor="pg-textarea">Notes</Label>
                <Textarea id="pg-textarea" placeholder="Rush order, confirm blank color" />
              </div>
              <div className="flex w-48 flex-col gap-2">
                <Label>Channel</Label>
                <Select defaultValue="etsy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="pg-check" defaultChecked />
                  <Label htmlFor="pg-check">Rush order</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="pg-switch" defaultChecked />
                  <Label htmlFor="pg-switch">Auto-print label</Label>
                </div>
              </div>
              <RadioGroup defaultValue="s" className="flex flex-row gap-3">
                {["s", "m", "l"].map((size) => (
                  <div key={size} className="flex items-center gap-1.5">
                    <RadioGroupItem id={`pg-size-${size}`} value={size} />
                    <Label htmlFor={`pg-size-${size}`}>{size.toUpperCase()}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Section>

            <Section title="Feedback & overlays">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Progress value={62} className="w-40" />
              <Skeleton className="h-8 w-32" />
              <Kbd>⌘K</Kbd>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>A tooltip</TooltipContent>
              </Tooltip>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Popover</Button>
                </PopoverTrigger>
                <PopoverContent>Popover content goes here.</PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Dropdown</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel order?</DialogTitle>
                    <DialogDescription>This can't be undone.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Back
                    </Button>
                    <Button variant="destructive" onClick={() => setDialogOpen(false)}>
                      Cancel order
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Item detail</SheetTitle>
                    <SheetDescription>Side drawer content.</SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

              <Button variant="outline" onClick={() => setCommandOpen(true)}>
                Open ⌘K <Kbd className="ml-2">⌘K</Kbd>
              </Button>
              <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
                <CommandInput placeholder="Type a command…" />
                <CommandList>
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandGroup heading="Navigate">
                    <CommandItem>Today</CommandItem>
                    <CommandItem>Orders</CommandItem>
                    <CommandItem>Gang sheets</CommandItem>
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
            </Section>

            <Section title="Tabs & scroll area">
              <Tabs defaultValue="a" className="w-72">
                <TabsList>
                  <TabsTrigger value="a">Details</TabsTrigger>
                  <TabsTrigger value="b">History</TabsTrigger>
                </TabsList>
                <TabsContent value="a">Order details go here.</TabsContent>
                <TabsContent value="b">Audit history goes here.</TabsContent>
              </Tabs>
              <ScrollArea className="h-24 w-48 rounded border border-border p-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <p key={i} className="py-0.5 text-sm">
                    Row {i}
                  </p>
                ))}
              </ScrollArea>
            </Section>

            <Section title="Avatars & cards">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/64" alt="" />
                <AvatarFallback>DB</AvatarFallback>
              </Avatar>
              <Card className="w-64">
                <CardHeader>
                  <CardTitle>Desert Bloom Tees</CardTitle>
                  <CardDescription>Owner: Dana</CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-2" />
                  <p className="text-sm text-muted-foreground">300 orders this month.</p>
                </CardContent>
              </Card>
            </Section>

            <Section title="App: StatCard, StatusBadge, ChannelBadge, ConfidenceBadge, Money, ShipBy">
              <StatCard label="Due today" value="24" delta="+3 vs yesterday" tone="warning" icon={Home} />
              <StatCard label="Revenue" value={<Money cents={482310} />} tone="success" icon={CreditCard} />
              <StatCard label="At risk" value="2" tone="danger" deltaDirection="down" delta="-1" icon={Settings} />
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {ORDER_ITEM_STATES.map((s) => (
                    <StatusBadge key={s} state={s} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CHANNELS.map((c) => (
                    <ChannelBadge key={c} channel={c} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CONFIDENCE_BANDS.map((b) => (
                    <ConfidenceBadge key={b} band={b} />
                  ))}
                  <ConfidenceBadge band="low" label="Custom override label" />
                </div>
                <p className="text-sm">
                  <RelativeTime value={new Date(Date.now() - 3_600_000).toISOString()} /> /{" "}
                  <ShipByBadge shipBy={new Date(Date.now() + 2_000_000).toISOString()} />
                </p>
              </div>
            </Section>

            <Section title="Empty state & file drop">
              <EmptyState title="No orders yet" description="Connect a channel to import orders." />
              <FileDrop onFiles={() => {}} accept=".csv" hint="CSV up to 10MB" className="w-72" />
            </Section>

            <Section title="Data table (200 rows, virtualized)">
              <DataTable columns={columns} data={rows} getRowId={(r) => r.id} enableRowSelection className="w-full" />
            </Section>

            <Section title="Floor: ScanResult, PinPad, StationHeader">
              <div className="flex flex-col gap-2">
                <Button onClick={() => setScan("ok")}>Show OK</Button>
                <Button variant="destructive" onClick={() => setScan("blocked")}>
                  Show BLOCKED
                </Button>
                <Button variant="outline" onClick={() => setScan(null)}>
                  Hide
                </Button>
              </div>
              <PinPad value={pin} onChange={setPin} length={4} />
              <div className="w-full overflow-hidden rounded border border-border">
                <StationHeader station="press" stationLabel="Press" operatorName="Maria" online />
              </div>
            </Section>
          </div>
        </div>
      </div>

      {scan && (
        <div className="fixed inset-0 z-[100]">
          <ScanResult
            status={scan}
            title={scan === "ok" ? "Match" : "Blocked"}
            details={["Order #1042", "Item 2 of 3", "Design: Desert Sunset"]}
            actions={
              <Button variant="secondary" onClick={() => setScan(null)}>
                Close
              </Button>
            }
          />
        </div>
      )}

      <Toaster />
    </TooltipProvider>
  );
}
