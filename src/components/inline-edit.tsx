import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineEditProps {
  value: string | number;
  type?: 'text' | 'number' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: (value: string) => string | null;
  onSave: (value: string | number) => Promise<void>;
  onCancel?: () => void;
  className?: string;
  fieldName?: string;
  autoSuggestions?: string[];
}

export function InlineEdit({
  value,
  type = 'text',
  options = [],
  placeholder,
  validation,
  onSave,
  onCancel,
  className,
  fieldName,
  autoSuggestions = []
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (editValue && autoSuggestions.length > 0) {
      const filtered = autoSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(editValue.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [editValue, autoSuggestions]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value.toString());
    setError(null);
  };

  const handleSave = async () => {
    if (validation) {
      const validationError = validation(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsLoading(true);
    try {
      const finalValue = type === 'number' ? parseFloat(editValue) : editValue;
      await onSave(finalValue);
      setIsEditing(false);
      setError(null);
      
      toast({
        title: "✅ Atualizado com sucesso!",
        description: `${fieldName || 'Campo'} atualizado. Obrigado por manter os dados atualizados!`,
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      setError("Erro ao salvar. Tente novamente.");
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente ou contate o suporte.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value.toString());
    setError(null);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className={cn("group flex items-center gap-2 py-1", className)}>
        <span className="flex-1">
          {value || <span className="text-muted-foreground italic">Não definido</span>}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {type === 'textarea' ? (
          <Textarea
            ref={inputRef as any}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1"
            rows={3}
          />
        ) : type === 'select' ? (
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={error ? "border-destructive" : ""}
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-3 py-2 text-left hover:bg-muted transition-colors"
                    onClick={() => setEditValue(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={isLoading}
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
        >
          <Check className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={isLoading}
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}