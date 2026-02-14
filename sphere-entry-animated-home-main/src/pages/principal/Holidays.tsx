import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Edit, Save, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import api from "@/api/api";


interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'national' | 'regional' | 'school' | 'religious';
  description?: string;
}

const Holidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHoliday, setNewHoliday] = useState<Omit<Holiday, 'id'>>({
    name: '',
    date: new Date(),
    type: 'school',
    description: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Holiday | null>(null);
  const { toast } = useToast();

  // ================= LOAD HOLIDAYS =================
  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const res = await api.get("/api/holidays");

        const formatted = res.data.map((holiday: any) => ({
          id: holiday._id,
          name: holiday.name,
          date: new Date(holiday.date),
          type: holiday.type,
          description: holiday.description,
        }));

        setHolidays(formatted);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load holidays",
          variant: "destructive"
        });
      }
    };

    loadHolidays();
  }, []);

  // ================= ADD HOLIDAY =================
  const handleAddHoliday = async () => {
    if (!newHoliday.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a holiday name",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await api.post("/api/holidays", {
        name: newHoliday.name,
        date: newHoliday.date,
        type: newHoliday.type,
        description: newHoliday.description
      });

      const createdHoliday: Holiday = {
        id: res.data._id,
        name: res.data.name,
        date: new Date(res.data.date),
        type: res.data.type,
        description: res.data.description
      };

      setHolidays(prev => [...prev, createdHoliday]);

      setNewHoliday({
        name: '',
        date: new Date(),
        type: 'school',
        description: ''
      });

      toast({
        title: "Success",
        description: "Holiday added successfully"
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add holiday",
        variant: "destructive"
      });
    }
  };

  // ================= DELETE HOLIDAY =================
  const handleDeleteHoliday = async (id: string) => {
    try {
      await api.delete(`/api/holidays/${id}`);

      setHolidays(prev => prev.filter(h => h.id !== id));

      toast({
        title: "Deleted",
        description: "Holiday removed successfully"
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete holiday",
        variant: "destructive"
      });
    }
  };

  // ================= START EDIT =================
  const startEdit = (holiday: Holiday) => {
    setEditingId(holiday.id);
    setEditData({ ...holiday });
  };

  // ================= SAVE EDIT =================
  const saveEdit = async () => {
    if (!editData?.name.trim()) {
      toast({
        title: "Error",
        description: "Holiday name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await api.put(`/api/holidays/${editingId}`, {
        name: editData.name,
        date: editData.date,
        type: editData.type,
        description: editData.description
      });

      const updatedHoliday: Holiday = {
        id: res.data._id,
        name: res.data.name,
        date: new Date(res.data.date),
        type: res.data.type,
        description: res.data.description
      };

      setHolidays(prev =>
        prev.map(h => h.id === editingId ? updatedHoliday : h)
      );

      setEditingId(null);
      setEditData(null);

      toast({
        title: "Updated",
        description: "Holiday updated successfully"
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update holiday",
        variant: "destructive"
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const getTypeColor = (type: Holiday['type']) => {
    switch (type) {
      case 'national': return 'bg-red-100 text-red-800 border-red-300';
      case 'regional': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'school': return 'bg-green-100 text-green-800 border-green-300';
      case 'religious': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeLabel = (type: Holiday['type']) => {
    switch (type) {
      case 'national': return 'National';
      case 'regional': return 'Regional';
      case 'school': return 'School';
      case 'religious': return 'Religious';
      default: return type;
    }
  };

  const sortedHolidays = [...holidays].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Holidays Management</h1>
          <p className="text-gray-600">Manage school holidays and breaks for the academic year</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Holiday
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="name">Holiday Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Summer Break, Diwali"
                    value={newHoliday.name}
                    onChange={(e) =>
                      setNewHoliday({ ...newHoliday, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newHoliday.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newHoliday.date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newHoliday.date}
                        onSelect={(date) =>
                          date && setNewHoliday({ ...newHoliday, date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['national', 'regional', 'school', 'religious'] as const).map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={newHoliday.type === type ? "default" : "outline"}
                        className="capitalize"
                        onClick={() => setNewHoliday({ ...newHoliday, type })}
                      >
                        {getTypeLabel(type)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Additional details"
                    value={newHoliday.description}
                    onChange={(e) =>
                      setNewHoliday({ ...newHoliday, description: e.target.value })
                    }
                  />
                </div>

                <Button
                  onClick={handleAddHoliday}
                  className="w-full"
                  disabled={!newHoliday.name.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Holiday
                </Button>

              </CardContent>
            </Card>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Holidays will be visible to teachers, students, and parents.
              </AlertDescription>
            </Alert>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>School Holidays ({sortedHolidays.length})</CardTitle>
              </CardHeader>
              <CardContent>

                {sortedHolidays.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No holidays scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedHolidays.map((holiday) => (
                      <div
                        key={holiday.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >

                        {editingId === holiday.id && editData ? (
                          <>
                            <Input
                              value={editData.name}
                              onChange={(e) =>
                                setEditData({ ...editData, name: e.target.value })
                              }
                            />

                            <Button size="sm" onClick={saveEdit}>
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>

                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <h3 className="font-semibold text-lg">{holiday.name}</h3>

                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center text-gray-600">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {format(holiday.date, "MMMM do, yyyy")}
                              </div>

                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(holiday.type)}`}>
                                {getTypeLabel(holiday.type)}
                              </span>
                            </div>

                            {holiday.description && (
                              <p className="text-gray-600 mt-2">{holiday.description}</p>
                            )}

                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline" onClick={() => startEdit(holiday)}>
                                <Edit className="w-4 h-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteHoliday(holiday.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}

                      </div>
                    ))}
                  </div>
                )}

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Holidays;
