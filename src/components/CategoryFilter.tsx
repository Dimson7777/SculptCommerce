import { Button } from "@/components/ui/button";

interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter = ({ categories, selected, onSelect }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === "All" ? "default" : "secondary"}
        size="sm"
        onClick={() => onSelect("All")}
        className="font-heading uppercase tracking-wider"
      >
        All
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selected === cat ? "default" : "secondary"}
          size="sm"
          onClick={() => onSelect(cat)}
          className="font-heading uppercase tracking-wider"
        >
          {cat}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
