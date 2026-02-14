import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  ArrowLeft,
  Bus,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Trash,
} from 'lucide-react';

import AnimatedBackground from '@/components/AnimatedBackground';
import AddBusForm from '@/components/AddBusForm';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '@/api/api';

/* ================= TYPES ================= */

interface Driver {
  name: string;
}

type BusStatus = 'On Time' | 'Delayed' | 'Arrived';

interface BusRoute {
  _id: string;
  busId: string;
  routeName: string;
  driver?: Driver;
  currentStop?: string;
  status?: BusStatus;
  eta?: string;
}

/* ================= COMPONENT ================= */

const BusTracking: React.FC = () => {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchBuses();
  }, []);

  /* ================= API ================= */

  const fetchBuses = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.get<BusRoute[]>('/addbus');
      setBusRoutes(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to fetch buses');
      }
      setBusRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBusAdded = (): void => {
    toast.success('✅ Bus added successfully!');
    fetchBuses();
    setShowForm(false);
  };

  const handleDeleteBus = async (busId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return;

    try {
      await api.delete(`/addbus/${busId}`);
      toast.success('🗑️ Bus deleted successfully!');
      fetchBuses();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to delete bus');
      }
    }
  };

  /* ================= HELPERS ================= */

  const getStatusIcon = (status?: BusStatus) => {
    switch (status) {
      case 'On Time':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Delayed':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Arrived':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: BusStatus): string => {
    switch (status) {
      case 'On Time':
        return 'bg-green-100 text-green-800';
      case 'Delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Arrived':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen p-4 bg-gray-50 relative">
      <AnimatedBackground />

      <ToastContainer autoClose={2500} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/principal')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Bus className="w-6 h-6 text-emerald-600" />
              <h1 className="text-xl font-bold">Bus Tracking System</h1>
            </div>
          </div>

          <Button
            className="bg-emerald-600 text-white"
            onClick={() => setShowForm(true)}
          >
            + Add New Bus
          </Button>
        </div>

        {/* ADD FORM */}
        {showForm && (
          <div className="bg-white p-4 rounded-lg shadow">
            <AddBusForm onClose={handleBusAdded} />
          </div>
        )}

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Live Bus Tracking</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : busRoutes.length === 0 ? (
              <p className="text-center">No bus data available</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bus ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {busRoutes.map((bus) => (
                    <TableRow key={bus._id}>
                      <TableCell>{bus.busId}</TableCell>
                      <TableCell>{bus.routeName}</TableCell>
                      <TableCell>{bus.driver?.name ?? 'N/A'}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {bus.currentStop ?? 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${getStatusColor(
                            bus.status
                          )}`}
                        >
                          {bus.status ?? 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Clock className="w-4 h-4 inline mr-1" />
                        {bus.eta ?? 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBus(bus._id)}
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusTracking;
