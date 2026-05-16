"use client";

import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type Item = {
  id: string;
  title: string;
  y: number;
};

function SortableItem({ item }: { item: Item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="siloam-card siloam-card-hover"
      style={{
        ...style,
        padding: 20,
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <button
        {...attributes}
        {...listeners}
        className="siloam-button siloam-button-ghost"
        style={{
          width: 42,
          height: 42,
          padding: 0,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <GripVertical size={18} />
      </button>

      <div>
        <p className="siloam-eyebrow" style={{ margin: 0 }}>
          Dashboard block
        </p>

        <h3
          style={{
            margin: "6px 0 0",
            fontSize: 20,
            letterSpacing: "-0.03em",
          }}
        >
          {item.title}
        </h3>
      </div>
    </div>
  );
}

export default function DashboardBuilder() {
  const supabase = createBrowserSupabase();

  const [items, setItems] = useState<Item[]>([
    { id: "revenue", title: "Revenue Overview", y: 0 },
    { id: "inventory", title: "Inventory Status", y: 1 },
    { id: "profit", title: "Profit Analytics", y: 2 },
    { id: "recent", title: "Recent Activity", y: 3 },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  useEffect(() => {
    async function loadLayout() {
      const { data, error } = await supabase
        .from("dashboard_layout")
        .select("*")
        .order("y", { ascending: true });

      if (error) {
        console.error("Error loading dashboard layout:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setItems(
          data.map((row) => ({
            id: row.id,
            title: row.title,
            y: row.y,
          }))
        );
      }
    }

    loadLayout();
  }, [supabase]);

  async function saveLayout(nextItems: Item[]) {
    const rows = nextItems.map((item, index) => ({
      id: item.id,
      title: item.title,
      y: index,
    }));

    const { error } = await supabase
      .from("dashboard_layout")
      .upsert(rows, { onConflict: "id" });

    if (error) {
      console.error("Error saving dashboard layout:", error.message);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((currentItems) => {
      const oldIndex = currentItems.findIndex((item) => item.id === active.id);
      const newIndex = currentItems.findIndex((item) => item.id === over.id);

      const nextItems = arrayMove(currentItems, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          y: index,
        })
      );

      saveLayout(nextItems);

      return nextItems;
    });
  }

  return (
    <section className="siloam-card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <p className="siloam-eyebrow" style={{ margin: 0 }}>
          Layout Builder
        </p>

        <h2
          style={{
            fontSize: 34,
            lineHeight: 1,
            letterSpacing: "-0.05em",
            margin: "10px 0 10px",
          }}
        >
          Customize your dashboard
        </h2>

        <p
          className="siloam-muted"
          style={{
            margin: 0,
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          Drag and reorder your dashboard blocks. Your layout will be saved
          automatically.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </section>
  );
}
