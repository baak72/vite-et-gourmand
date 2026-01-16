import React, { useState, useEffect } from 'react';
import { getAllOrders, getEmployees, createEmployee, disableEmployee, reactivateEmployee, deleteEmployee } from '../utils/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useForm } from 'react-hook-form';
import { Users, DollarSign, TrendingUp, UserPlus, Trash2, Power, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

// --- Info-bulle (lors du passage de la souris sur le graphique) ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 p-4 border border-white/10 shadow-xl rounded-lg">
        <p className="font-bold text-white mb-2 font-montserrat">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-zinc-400">
            Commandes : <span className="font-bold text-white">{data.count}</span>
          </p>
          <p className="text-sm text-emerald-400">
            CA : <span className="font-bold">{data.revenue.toFixed(2)} €</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const AdminDashboardView = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [chartData, setChartData] = useState([]);

  // --- ÉTATS POUR LES EMPLOYÉS ---
  const [employees, setEmployees] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);

  // Formulaire pour la création d'employé
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const loadAllData = async () => {
    try {
      // --- A. ANALYTICS ---
      const orders = await getAllOrders();

      let globalCA = 0;
      const menuStats = {};

      orders.forEach(order => {
        const priceString = order.prix_total.replace(' €', '').replace(',', '.');
        const price = parseFloat(priceString);
        const isValidPrice = !isNaN(price) && order.statut !== 'annulé';

        // Calcul Global
        if (isValidPrice) {
          globalCA += price;
        }

        // Calcul par Menu
        const menuName = order.nom_menu || "Menu Inconnu";

        if (!menuStats[menuName]) {
          menuStats[menuName] = { count: 0, revenue: 0 };
        }

        menuStats[menuName].count += 1;

        if (isValidPrice) {
          menuStats[menuName].revenue += price;
        }
      });

      // FORMATAGE POUR LE GRAPHIQUE
      const formattedChartData = Object.keys(menuStats).map(key => ({
        name: key,
        count: menuStats[key].count,
        revenue: menuStats[key].revenue
      }));

      setTotalRevenue(globalCA.toFixed(2));
      setTotalOrders(orders.length);
      setChartData(formattedChartData);

      // --- B. GESTION EMPLOYÉS ---
      const employeesList = await getEmployees();
      setEmployees(employeesList);

    } catch (error) {
      console.error("Erreur calcul stats/employés:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- CRÉER UN EMPLOYÉ ---
  const onCreateEmployee = async (data) => {
    setActionMessage(null);
    try {
      await createEmployee(data.email, data.password, data.nom, data.prenom);

      setActionMessage({ type: 'success', text: `Employé ${data.prenom} ${data.nom} créé avec succès !` });
      reset();
      loadAllData();
    } catch (error) {
      console.error("Erreur création:", error);
      setActionMessage({ type: 'error', text: "Erreur lors de la création. Vérifiez les champs." });
    }
  };

  // --- DÉSACTIVER UN EMPLOYÉ ---
  const onDisableEmployee = async (uid) => {
    if (!window.confirm("Êtes-vous sûr de vouloir désactiver cet employé ?")) return;

    setActionMessage(null);
    try {
      await disableEmployee(uid);
      setActionMessage({ type: 'success', text: "Accès employé désactivé." });
      loadAllData();
    } catch (error) {
      console.error("Erreur désactivation:", error);
      setActionMessage({ type: 'error', text: "Erreur lors de la désactivation." });
    }
  };

  // --- RÉACTIVER UN EMPLOYÉ ---
  const onReactivateEmployee = async (uid) => {
    setActionMessage(null);
    try {
      await reactivateEmployee(uid);
      setActionMessage({ type: 'success', text: "Accès employé réactivé." });
      loadAllData();
    } catch (error) {
      console.error("Erreur réactivation:", error);
      setActionMessage({ type: 'error', text: "Erreur lors de la réactivation." });
    }
  };

  // --- SUPPRIMER UN EMPLOYÉ ---
  const onDeleteEmployee = async (uid) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet employé ? Cette action est irréversible.")) return;

    setActionMessage(null);
    try {
      await deleteEmployee(uid);
      setActionMessage({ type: 'success', text: "Compte employé supprimé définitivement." });
      loadAllData();
    } catch (error) {
      console.error("Erreur suppression:", error);
      setActionMessage({ type: 'error', text: "Erreur lors de la suppression." });
    }
  };

  // COULEURS
  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-2 text-sm">Gestion Globale</h2>
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white">
            Dashboard Admin
          </h1>
        </div>

        {/* --- BLOC 1 : LES CHIFFRES CLÉS --- */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Carte CA */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign className="w-24 h-24 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Chiffre d'Affaires Total</h2>
              <p className="text-xs text-zinc-500 mb-4">Calculé sur les commandes valides</p>
              <p className="text-5xl font-playfair font-bold text-white">{totalRevenue} <span className="text-emerald-500 text-2xl">€</span></p>
            </div>
          </div>

          {/* Carte Volume */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-24 h-24 text-amber-500" />
            </div>
            <div>
              <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Volume de Commandes</h2>
              <p className="text-xs text-zinc-500 mb-4">Toutes commandes confondues</p>
              <p className="text-5xl font-playfair font-bold text-white">{totalOrders}</p>
            </div>
          </div>
        </section>

        {/* --- BLOC 2 : LE GRAPHIQUE --- */}
        <section className="mb-12 bg-zinc-900 border border-white/5 shadow-xl rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-white font-montserrat">
              Performance des Menus
            </h2>
          </div>

          <div className="h-96 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />

                  <XAxis
                    dataKey="name"
                    angle={-15}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12, fill: '#a1a1aa' }}
                    interval={0}
                    tickLine={false}
                    axisLine={{ stroke: '#3f3f46' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#a1a1aa' }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: '#ffffff', opacity: 0.05 }}
                  />

                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600">
                <p>Pas assez de données pour afficher le graphique.</p>
              </div>
            )}
          </div>
        </section>

        {/* --- BLOC 3 : GESTION DU PERSONNEL --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-white font-montserrat">Gestion du Personnel</h2>
          </div>

          {actionMessage && (
            <div className={`p-4 mb-6 rounded-xl border flex items-center gap-3 ${actionMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {actionMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="font-semibold">{actionMessage.text}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* COLONNE GAUCHE : LISTE DES EMPLOYÉS */}
            <div className="lg:col-span-2 bg-zinc-900 border border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-zinc-950/50 px-6 py-4 border-b border-white/5">
                <h3 className="font-bold text-zinc-300 uppercase text-xs tracking-wider">Équipe Actuelle</h3>
              </div>
              <div className="overflow-x-auto">
                {employees.length === 0 ? (
                  <p className="p-8 text-center text-zinc-500">Aucun compte employé trouvé.</p>
                ) : (
                  <table className="min-w-full">
                    <thead className="bg-zinc-950/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Identité</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-white font-medium">{emp.prenom} {emp.nom}</span>
                              <span className="text-zinc-500 text-xs">{emp.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {emp.est_actif ? (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Actif
                              </span>
                            ) : (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                                Désactivé
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                            {/* Bouton Désactiver / Réactiver */}
                            {emp.est_actif ? (
                              <button
                                onClick={() => onDisableEmployee(emp.id)}
                                title="Désactiver le compte"
                                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                              >
                                <Power className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => onReactivateEmployee(emp.id)}
                                title="Réactiver le compte"
                                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}

                            {/* Bouton Supprimer */}
                            <button
                              onClick={() => onDeleteEmployee(emp.id)}
                              title="Supprimer définitivement"
                              className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* COLONNE DROITE : CRÉATION */}
            <div className="bg-zinc-900 border border-white/5 shadow-xl rounded-2xl overflow-hidden h-fit">
              <div className="bg-amber-500 px-6 py-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-white" />
                <h3 className="font-bold text-white uppercase tracking-wide text-sm">Nouveau Collaborateur</h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit(onCreateEmployee)} className="space-y-4">

                  {/* NOM / PRÉNOM */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nom</label>
                      <input
                        type="text"
                        required
                        {...register("nom")}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-hidden transition-colors"
                        placeholder="Dupont"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Prénom</label>
                      <input
                        type="text"
                        required
                        {...register("prenom")}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-hidden transition-colors"
                        placeholder="Jean"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">E-mail</label>
                    <input
                      type="email"
                      required
                      {...register("email")}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-hidden transition-colors"
                      placeholder="prenom.nom@viteetgourmand.fr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Mot de passe</label>
                    <input
                      type="password"
                      required
                      {...register("password")}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-hidden transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold uppercase tracking-wide text-white bg-amber-500 hover:bg-amber-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Création..." : "Créer le compte"}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-4 text-center leading-tight">
                    L'employé devra utiliser ces identifiants pour accéder à son dashboard.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardView;