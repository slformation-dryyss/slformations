"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Car,
    Plus,
    Filter,
    AlertTriangle,
    CheckCircle,
    Wrench,
    Calendar,
    User,
    Fuel,
    Settings,
} from "lucide-react";
import { CreateVehicleModal } from "./components/CreateVehicleModal";

type Vehicle = {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    year: number;
    transmission: string;
    fuelType: string;
    status: string;
    isAvailable: boolean;
    currentKm: number;
    lastMaintenanceDate: Date | null;
    nextMaintenanceDate: Date | null;
    insuranceExpiryDate: Date | null;
    technicalControlDate: Date | null;
    assignedInstructor: {
        id: string;
        user: {
            firstName: string | null;
            lastName: string | null;
            email: string;
        };
    } | null;
    maintenanceRecords: any[];
    _count: {
        lessons: number;
        maintenanceRecords: number;
    };
};

type Instructor = {
    id: string;
    user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
    };
};

type Stats = {
    totalVehicles: number;
    activeVehicles: number;
    inMaintenance: number;
    maintenanceDueSoon: number;
    maintenanceOverdue: number;
};

interface VehiclesClientProps {
    vehicles: Vehicle[];
    stats: Stats | null;
    instructors: Instructor[];
    currentFilters: {
        status?: string;
        transmission?: string;
        instructorId?: string;
    };
}

export function VehiclesClient({ vehicles, stats, instructors, currentFilters }: VehiclesClientProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const getStatusBadge = (status: string, isAvailable: boolean) => {
        if (status === "MAINTENANCE") {
            return (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                    En maintenance
                </span>
            );
        }
        if (status === "RETIRED") {
            return (
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                    Retiré
                </span>
            );
        }
        if (!isAvailable) {
            return (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    Indisponible
                </span>
            );
        }
        return (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                Disponible
            </span>
        );
    };

    const getMaintenanceAlert = (vehicle: Vehicle) => {
        if (!vehicle.nextMaintenanceDate) return null;

        const now = new Date();
        const nextMaintenance = new Date(vehicle.nextMaintenanceDate);
        const daysUntil = Math.ceil((nextMaintenance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil < 0) {
            return (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Maintenance en retard</span>
                </div>
            );
        }

        if (daysUntil <= 30) {
            return (
                <div className="flex items-center gap-1 text-orange-600 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Maintenance dans {daysUntil}j</span>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="pb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion des Véhicules</h1>
                    <p className="text-slate-500 mt-1">
                        Gérez votre flotte de véhicules et leur maintenance
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-600 transition"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un véhicule
                </button>
            </div>

            {/* Statistiques */}
            {stats && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Car className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-slate-500 truncate">
                                            Total Véhicules
                                        </dt>
                                        <dd className="text-2xl font-bold text-slate-900">{stats.totalVehicles}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-slate-500 truncate">
                                            Disponibles
                                        </dt>
                                        <dd className="text-2xl font-bold text-slate-900">{stats.activeVehicles}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Wrench className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-slate-500 truncate">
                                            En Maintenance
                                        </dt>
                                        <dd className="text-2xl font-bold text-slate-900">{stats.inMaintenance}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Calendar className="h-6 w-6 text-amber-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-slate-500 truncate">
                                            Maintenance Proche
                                        </dt>
                                        <dd className="text-2xl font-bold text-slate-900">{stats.maintenanceDueSoon}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-slate-500 truncate">
                                            En Retard
                                        </dt>
                                        <dd className="text-2xl font-bold text-slate-900">{stats.maintenanceOverdue}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="mb-6">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                    <Filter className="w-4 h-4" />
                    Filtres
                </button>

                {showFilters && (
                    <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Statut
                                </label>
                                <select
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                    defaultValue={currentFilters.status || "ALL"}
                                    onChange={(e) => {
                                        const url = new URL(window.location.href);
                                        if (e.target.value === "ALL") {
                                            url.searchParams.delete("status");
                                        } else {
                                            url.searchParams.set("status", e.target.value);
                                        }
                                        window.location.href = url.toString();
                                    }}
                                >
                                    <option value="ALL">Tous</option>
                                    <option value="ACTIVE">Actif</option>
                                    <option value="MAINTENANCE">En maintenance</option>
                                    <option value="RETIRED">Retiré</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Transmission
                                </label>
                                <select
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                    defaultValue={currentFilters.transmission || "ALL"}
                                    onChange={(e) => {
                                        const url = new URL(window.location.href);
                                        if (e.target.value === "ALL") {
                                            url.searchParams.delete("transmission");
                                        } else {
                                            url.searchParams.set("transmission", e.target.value);
                                        }
                                        window.location.href = url.toString();
                                    }}
                                >
                                    <option value="ALL">Toutes</option>
                                    <option value="MANUAL">Manuelle</option>
                                    <option value="AUTOMATIC">Automatique</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Instructeur
                                </label>
                                <select
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                    defaultValue={currentFilters.instructorId || ""}
                                    onChange={(e) => {
                                        const url = new URL(window.location.href);
                                        if (!e.target.value) {
                                            url.searchParams.delete("instructor");
                                        } else {
                                            url.searchParams.set("instructor", e.target.value);
                                        }
                                        window.location.href = url.toString();
                                    }}
                                >
                                    <option value="">Tous</option>
                                    {instructors.map((instructor) => (
                                        <option key={instructor.id} value={instructor.id}>
                                            {instructor.user.firstName} {instructor.user.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Liste des véhicules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun véhicule</h3>
                        <p className="text-slate-500">
                            Commencez par ajouter votre premier véhicule
                        </p>
                    </div>
                ) : (
                    vehicles.map((vehicle) => (
                        <Link
                            key={vehicle.id}
                            href={`/admin/driving-lessons/vehicles/${vehicle.id}`}
                            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                                        <Car className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {vehicle.brand} {vehicle.model}
                                        </h3>
                                        <p className="text-sm text-slate-500">{vehicle.licensePlate}</p>
                                    </div>
                                </div>
                                {getStatusBadge(vehicle.status, vehicle.isAvailable)}
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>{vehicle.year}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Settings className="w-4 h-4" />
                                    <span>{vehicle.transmission === "MANUAL" ? "Manuelle" : "Automatique"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Fuel className="w-4 h-4" />
                                    <span>{vehicle.fuelType}</span>
                                </div>
                                {vehicle.assignedInstructor && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <User className="w-4 h-4" />
                                        <span>
                                            {vehicle.assignedInstructor.user.firstName}{" "}
                                            {vehicle.assignedInstructor.user.lastName}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {getMaintenanceAlert(vehicle)}

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <span>{vehicle._count.lessons} cours</span>
                                <span>{vehicle.currentKm.toLocaleString()} km</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {showCreateModal && (
                <CreateVehicleModal
                    instructors={instructors}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
}
