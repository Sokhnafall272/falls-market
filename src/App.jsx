import { useState, useEffect } from 'react'

// =========================================================
// ⚙️ CONFIG CLIENT - TU CHANGES SEULEMENT ICI POUR CHAQUE CLIENT
// =========================================================
const CONFIG = {
  nomBoutique: 'FALLS MARKET',
  slogan: 'Petite Supérette - Rufisque',
  couleurPrincipale: '#0a7a42',
  couleurBouton: '#ff6b00',
  quartier: 'Rufisque, Dakar - Sénégal',
  horaires: 'Ouvert 7j/7 de 8h à 22h',
  livraisonGratuite: 20000,
  fraisLivraison: 1000,
  codeAdmin: '1234',
}

// =========================================================
// PRODUITS - TU METS LES PRODUITS DU CLIENT ICI
// =========================================================
const produits = [
  { id: 1, nom: 'Riz Parfumé 5kg', prix: 6500, ancien: 7500, emoji: '🍚', cat: 'Epicerie', promo: 'PROMO' },
  { id: 2, nom: 'Huile Tournesol 1L', prix: 2800, ancien: 0, emoji: '🫒', cat: 'Epicerie', promo: '' },
  { id: 3, nom: 'Sucre 1kg', prix: 1100, ancien: 0, emoji: '🧂', cat: 'Epicerie', promo: '' },
  { id: 4, nom: 'Pâtes Spaghetti 500g', prix: 1200, ancien: 0, emoji: '🍝', cat: 'Epicerie', promo: '' },
  { id: 5, nom: 'Tomate Concentrée', prix: 900, ancien: 0, emoji: '🥫', cat: 'Epicerie', promo: '' },
  { id: 6, nom: 'Bananes 1kg', prix: 1000, ancien: 1500, emoji: '🍌', cat: 'Fruits & Légumes', promo: '-33%' },
  { id: 7, nom: 'Tomates 1kg', prix: 800, ancien: 0, emoji: '🍅', cat: 'Fruits & Légumes', promo: '' },
  { id: 8, nom: 'Oignons 1kg', prix: 900, ancien: 0, emoji: '🧅', cat: 'Fruits & Légumes', promo: '' },
  { id: 9, nom: 'Pommes de Terre 2kg', prix: 2000, ancien: 2500, emoji: '🥔', cat: 'Fruits & Légumes', promo: '-20%' },
  { id: 10, nom: 'Mangues 1kg', prix: 1500, ancien: 0, emoji: '🥭', cat: 'Fruits & Légumes', promo: '' },
  { id: 11, nom: 'Carottes 1kg', prix: 1200, ancien: 0, emoji: '🥕', cat: 'Fruits & Légumes', promo: '' },
  { id: 12, nom: 'Poulet Entier', prix: 4500, ancien: 5500, emoji: '🍗', cat: 'Viandes & Poissons', promo: '-18%' },
  { id: 13, nom: 'Poisson Frais 1kg', prix: 6000, ancien: 0, emoji: '🐟', cat: 'Viandes & Poissons', promo: '' },
  { id: 14, nom: 'Viande Boeuf 1kg', prix: 5500, ancien: 0, emoji: '🥩', cat: 'Viandes & Poissons', promo: '' },
  { id: 15, nom: 'Jus Orange 1L', prix: 2500, ancien: 0, emoji: '🧃', cat: 'Boissons', promo: '' },
  { id: 16, nom: 'Eau Minérale 1.5L', prix: 500, ancien: 0, emoji: '💧', cat: 'Boissons', promo: '' },
  { id: 17, nom: 'Coca-Cola 1L', prix: 1500, ancien: 0, emoji: '🥤', cat: 'Boissons', promo: '' },
  { id: 18, nom: 'Café Touba 250g', prix: 2000, ancien: 0, emoji: '☕', cat: 'Boissons', promo: '' },
  { id: 19, nom: 'Lait Concentré', prix: 1800, ancien: 0, emoji: '🥛', cat: 'Laitiers & Frais', promo: '' },
  { id: 20, nom: 'Yaourt Nature x4', prix: 2200, ancien: 0, emoji: '🍦', cat: 'Laitiers & Frais', promo: '' },
  { id: 21, nom: 'Fromage Président', prix: 3500, ancien: 0, emoji: '🧀', cat: 'Laitiers & Frais', promo: '' },
  { id: 22, nom: 'Oeufs x12', prix: 2400, ancien: 0, emoji: '🥚', cat: 'Laitiers & Frais', promo: '' },
  { id: 23, nom: 'Savon Marseille', prix: 1500, ancien: 0, emoji: '🧼', cat: 'Hygiène & Maison', promo: '' },
  { id: 24, nom: 'Lessive Omo 1kg', prix: 4500, ancien: 5000, emoji: '🧺', cat: 'Hygiène & Maison', promo: '-10%' },
]

const categories = ['Tous', 'Fruits & Légumes', 'Viandes & Poissons', 'Epicerie', 'Boissons', 'Laitiers & Frais', 'Hygiène & Maison']
const statuts = ['En préparation', 'En livraison', 'Livrée', 'Annulée']

function App() {
  const [panier, setPanier] = useState({})
  const [cat, setCat] = useState('Tous')
  const [recherche, setRecherche] = useState('')
  const [showPanier, setShowPanier] = useState(false)
  const [etape, setEtape] = useState('boutique')
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')
  const [quartier, setQuartier] = useState('')
  const [paiement, setPaiement] = useState('Espèces à la livraison')
  const [filtreAdmin, setFiltreAdmin] = useState('Toutes')
  const [codeAdmin, setCodeAdmin] = useState('')
  const [commandes, setCommandes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('commandes_' + CONFIG.nomBoutique) || '[]') } catch { return [] }
  })
  const [derniereCommande, setDerniereCommande] = useState(null)

  useEffect(() => {
    localStorage.setItem('commandes_' + CONFIG.nomBoutique, JSON.stringify(commandes))
  }, [commandes])

  const ajouter = (id) => setPanier({ ...panier, [id]: (panier[id] || 0) + 1 })
  const retirer = (id) => {
    const n = { ...panier }
    if (n[id] > 1) n[id]--
    else delete n[id]
    setPanier(n)
  }

  const filtres = produits.filter(p => (cat === 'Tous' || p.cat === cat) && p.nom.toLowerCase().includes(recherche.toLowerCase()))
  const totalItems = Object.values(panier).reduce((a, b) => a + b, 0)
  const totalPrix = Object.entries(panier).reduce((s, [id, q]) => s + produits.find(x => x.id == id).prix * q, 0)
  const livraison = totalPrix >= CONFIG.livraisonGratuite ? 0 : CONFIG.fraisLivraison
  const totalFinal = totalPrix + livraison

  const validerCommande = () => {
    if (!nom || !tel || !quartier) { alert('Remplis Nom, Téléphone et Quartier'); return }
    const nouvelle = {
      id: 'CMD-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleString('fr-FR'),
      nom, tel, quartier, paiement,
      items: Object.entries(panier).map(([id, q]) => {
        const p = produits.find(x => x.id == id)
        return { nom: p.nom, emoji: p.emoji, q, prix: p.prix }
      }),
      total: totalFinal,
      statut: 'En préparation'
    }
    setCommandes([nouvelle, ...commandes])
    setDerniereCommande(nouvelle)
    setPanier({})
    setEtape('confirmation')
    setShowPanier(false)
  }

  const changerStatut = (idCmd, nouveauStatut) => {
    setCommandes(commandes.map(c => c.id === idCmd ? { ...c, statut: nouveauStatut } : c))
    if (derniereCommande && derniereCommande.id === idCmd) setDerniereCommande({ ...derniereCommande, statut: nouveauStatut })
  }

  const supprimerCommande = (idCmd) => {
    if (confirm('Supprimer cette commande ?')) setCommandes(commandes.filter(c => c.id !== idCmd))
  }

  const totalVentes = commandes.filter(c => c.statut !== 'Annulée').reduce((s, c) => s + c.total, 0)
  const enCours = commandes.filter(c => c.statut === 'En préparation' || c.statut === 'En livraison').length
  const livrees = commandes.filter(c => c.statut === 'Livrée').length
  const commandesFiltrees = filtreAdmin === 'Toutes' ? commandes : commandes.filter(c => c.statut === filtreAdmin)
  const couleurStatut = (s) => s === 'En préparation' ? '#fff3cd' : s === 'En livraison' ? '#cce5ff' : s === 'Livrée' ? '#d4edda' : '#f8d7da'

  // ================= PAGE ADMIN LOGIN =================
  if (etape === 'admin-login') {
    return (
      <div style={{ fontFamily: 'Arial', background: '#111', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ background: 'white', width: '100%', maxWidth: '380px', padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '50px' }}>🔐</div>
          <h2>Espace Vendeur</h2>
          <p style={{ fontWeight: 'bold' }}>{CONFIG.nomBoutique}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Entre le code admin du gérant.<br />Code de test : {CONFIG.codeAdmin}</p>
          <input value={codeAdmin} onChange={e => setCodeAdmin(e.target.value)} placeholder="Code admin" type="password" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box', textAlign: 'center', fontSize: '20px', letterSpacing: '5px' }} />
          <button onClick={() => { if (codeAdmin === CONFIG.codeAdmin) { setEtape('admin'); setCodeAdmin('') } else alert('Mauvais code !') }} style={{ width: '100%', background: CONFIG.couleurPrincipale, color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', marginTop: '15px', cursor: 'pointer' }}>Entrer</button>
          <button onClick={() => setEtape('boutique')} style={{ width: '100%', background: 'white', border: 'none', padding: '10px', cursor: 'pointer', color: '#666', marginTop: '10px' }}>← Retour boutique</button>
        </div>
      </div>
    )
  }

  // ================= PAGE ADMIN DASHBOARD =================
  if (etape === 'admin') {
    return (
      <div style={{ fontFamily: 'Arial', background: '#f2f3f5', minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0 }}>👨‍💼 Dashboard Vendeur<br /><span style={{ fontSize: '16px', color: '#666' }}>{CONFIG.nomBoutique}</span></h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEtape('boutique')} style={{ background: 'white', border: '1px solid #ddd', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer' }}>🛒 Voir Boutique</button>
              <button onClick={() => { if (confirm('Vider toutes les commandes ?')) setCommandes([]) }} style={{ background: '#ff4757', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer' }}>🗑️ Tout effacer</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', margin: '20px 0' }}>
            <div style={{ background: CONFIG.couleurPrincipale, color: 'white', padding: '18px', borderRadius: '15px' }}><p style={{ margin: 0, fontSize: '13px' }}>💰 TOTAL VENTES</p><h2 style={{ margin: '5px 0 0' }}>{totalVentes.toLocaleString()} F</h2></div>
            <div style={{ background: 'white', padding: '18px', borderRadius: '15px' }}><p style={{ margin: 0, fontSize: '13px' }}>📦 COMMANDES</p><h2 style={{ margin: '5px 0 0' }}>{commandes.length}</h2></div>
            <div style={{ background: CONFIG.couleurBouton, color: 'white', padding: '18px', borderRadius: '15px' }}><p style={{ margin: 0, fontSize: '13px' }}>🟡 EN COURS</p><h2 style={{ margin: '5px 0 0' }}>{enCours}</h2></div>
            <div style={{ background: 'white', padding: '18px', borderRadius: '15px' }}><p style={{ margin: 0, fontSize: '13px' }}>✅ LIVRÉES</p><h2 style={{ margin: '5px 0 0' }}>{livrees}</h2></div>
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '15px' }}>
            {['Toutes', ...statuts].map(s => (
              <button key={s} onClick={() => setFiltreAdmin(s)} style={{ whiteSpace: 'nowrap', padding: '9px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: filtreAdmin === s ? '#111' : 'white', color: filtreAdmin === s ? 'white' : '#333', fontWeight: 'bold' }}>{s} ({s === 'Toutes' ? commandes.length : commandes.filter(c => c.statut === s).length})</button>
            ))}
          </div>

          {commandesFiltrees.length === 0 ? (
            <div style={{ background: 'white', padding: '40px', borderRadius: '15px', textAlign: 'center' }}>
              <div style={{ fontSize: '50px' }}>📭</div>
              <p>Aucune commande {filtreAdmin !== 'Toutes' ? 'avec ce statut' : 'pour le moment'}.</p>
              <p style={{ color: '#888', fontSize: '13px' }}>Fais une fausse commande dans la boutique pour tester.</p>
            </div>
          ) : commandesFiltrees.map(c => (
            <div key={c.id} style={{ background: 'white', padding: '18px', borderRadius: '15px', marginBottom: '12px', borderLeft: `5px solid ${c.statut === 'Livrée' ? CONFIG.couleurPrincipale : c.statut === 'En livraison' ? '#007bff' : c.statut === 'Annulée' ? '#ff4757' : CONFIG.couleurBouton}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <b style={{ fontSize: '16px' }}>{c.id} - {c.nom}</b>
                <span style={{ background: couleurStatut(c.statut), padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>{c.statut}</span>
              </div>
              <p style={{ color: '#666', fontSize: '13px', margin: '8px 0' }}>📅 {c.date} | 📞 {c.tel} | 📍 {c.quartier} | 💳 {c.paiement}</p>
              <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '10px' }}>
                {c.items.map((it, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '2px 0' }}><span>{it.emoji} {it.nom} x{it.q}</span><span>{(it.prix * it.q).toLocaleString()} F</span></div>))}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', marginTop: '8px', paddingTop: '8px' }}><b>Total</b><b style={{ color: CONFIG.couleurPrincipale }}>{c.total.toLocaleString()} FCFA</b></div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                <label style={{ fontSize: '13px', alignSelf: 'center' }}>Changer statut :</label>
                <select value={c.statut} onChange={e => changerStatut(c.id, e.target.value)} style={{ padding: '9px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, minWidth: '150px' }}>
                  {statuts.map(s => (<option key={s}>{s}</option>))}
                </select>
                <a href={`tel:${c.tel}`} style={{ background: CONFIG.couleurPrincipale, color: 'white', textDecoration: 'none', padding: '9px 14px', borderRadius: '8px', fontWeight: 'bold' }}>📞 Appeler</a>
                <button onClick={() => supprimerCommande(c.id)} style={{ background: '#ff4757', color: 'white', border: 'none', padding: '9px 14px', borderRadius: '8px', cursor: 'pointer' }}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ================= PAGE CONFIRMATION =================
  if (etape === 'confirmation' && derniereCommande) {
    return (
      <div style={{ fontFamily: 'Arial', background: '#f2f3f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ background: 'white', maxWidth: '450px', width: '100%', borderRadius: '20px', padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '70px' }}>✅</div>
          <h2 style={{ color: CONFIG.couleurPrincipale }}>Commande confirmée !</h2>
          <p>Merci <b>{derniereCommande.nom}</b>, {CONFIG.nomBoutique} a bien reçu ta commande.</p>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px', textAlign: 'left', margin: '20px 0' }}>
            <p><b>N° Commande :</b> {derniereCommande.id}</p>
            <p><b>Quartier :</b> {derniereCommande.quartier}</p>
            <p><b>Paiement :</b> {derniereCommande.paiement}</p>
            <p><b>Statut :</b> <span style={{ background: couleurStatut(derniereCommande.statut), padding: '3px 10px', borderRadius: '10px' }}>{derniereCommande.statut}</span></p>
            <hr />
            {derniereCommande.items.map((it, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><span>{it.emoji} {it.nom} x{it.q}</span><b>{(it.prix * it.q).toLocaleString()} F</b></div>))}
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}><b>Total payé :</b><b style={{ color: CONFIG.couleurPrincipale }}>{derniereCommande.total.toLocaleString()} FCFA</b></div>
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>Livraison estimée : 45 min - 1h<br />On t'appelle au {derniereCommande.tel} avant de venir.</p>
          <button onClick={() => { setEtape('boutique'); setNom(''); setTel(''); setQuartier('') }} style={{ width: '100%', background: CONFIG.couleurPrincipale, color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Continuer mes achats</button>
          <button onClick={() => setEtape('mes-commandes')} style={{ width: '100%', background: 'white', border: '2px solid ' + CONFIG.couleurPrincipale, color: CONFIG.couleurPrincipale, padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Voir mes commandes</button>
        </div>
      </div>
    )
  }

  // ================= PAGE MES COMMANDES =================
  if (etape === 'mes-commandes') {
    return (
      <div style={{ fontFamily: 'Arial', background: '#f2f3f5', minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={() => setEtape('boutique')} style={{ background: 'white', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer' }}>← Retour boutique</button>
          <h2>📦 Mes Commandes ({commandes.length})</h2>
          {commandes.length === 0 ? <p style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>Aucune commande pour le moment.</p> : commandes.map(c => (
            <div key={c.id} style={{ background: 'white', padding: '18px', borderRadius: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>{c.id}</b><span style={{ background: couleurStatut(c.statut), padding: '4px 10px', borderRadius: '15px', fontSize: '12px' }}>{c.statut}</span></div>
              <p style={{ color: '#888', fontSize: '13px' }}>{c.date} - {c.nom} - {c.quartier}</p>
              {c.items.map((it, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>{it.emoji} {it.nom} x{it.q}</span><span>{(it.prix * it.q).toLocaleString()} F</span></div>))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}><b>Total</b><b style={{ color: CONFIG.couleurPrincipale }}>{c.total.toLocaleString()} FCFA</b></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ================= PAGE COMMANDE FORMULAIRE =================
  if (etape === 'commande') {
    return (
      <div style={{ fontFamily: 'Arial', background: '#f2f3f5', minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '25px', borderRadius: '15px' }}>
          <button onClick={() => setEtape('boutique')} style={{ border: 'none', background: '#eee', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>← Retour</button>
          <h2>📝 Finaliser ma commande</h2>
          <p style={{ color: '#666' }}>{CONFIG.nomBoutique} - {CONFIG.slogan}</p>
          <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '10px', marginBottom: '15px' }}>
            {Object.entries(panier).map(([id, q]) => {
              const p = produits.find(x => x.id == id)
              return <div key={id} style={{ display: 'flex', justifyContent: 'space-between' }}><span>{p.emoji} {p.nom} x{q}</span><b>{(p.prix * q).toLocaleString()} F</b></div>
            })}
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sous-total</span><span>{totalPrix.toLocaleString()} F</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Livraison {totalPrix >= CONFIG.livraisonGratuite ? '(Gratuite)' : ''}</span><span>{livraison === 0 ? 'Gratuite' : livraison.toLocaleString() + ' F'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginTop: '5px' }}><b>Total</b><b style={{ color: CONFIG.couleurPrincipale }}>{totalFinal.toLocaleString()} FCFA</b></div>
          </div>
          <label>Nom complet *</label>
          <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex: Fallou Ndiaye" style={{ width: '100%', padding: '12px', margin: '5px 0 12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <label>Téléphone *</label>
          <input value={tel} onChange={e => setTel(e.target.value)} placeholder="Ex: 77 123 45 67" style={{ width: '100%', padding: '12px', margin: '5px 0 12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <label>Quartier / Adresse *</label>
          <input value={quartier} onChange={e => setQuartier(e.target.value)} placeholder="Ex: Rufisque, Bargny, Keury Souf" style={{ width: '100%', padding: '12px', margin: '5px 0 12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <label>Paiement</label>
          <div style={{ display: 'flex', gap: '10px', margin: '8px 0 15px' }}>
            {['Espèces à la livraison', 'Orange Money', 'Wave'].map(m => (
              <button key={m} onClick={() => setPaiement(m)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: paiement === m ? '2px solid ' + CONFIG.couleurPrincipale : '1px solid #ddd', background: paiement === m ? '#e8f5e9' : 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{m}</button>
            ))}
          </div>
          <button onClick={validerCommande} style={{ width: '100%', background: CONFIG.couleurPrincipale, color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>✅ Confirmer la commande - {totalFinal.toLocaleString()} FCFA</button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888' }}>Ta commande reste enregistrée dans l'application.</p>
        </div>
      </div>
    )
  }

  // ================= PAGE BOUTIQUE =================
  return (
    <div style={{ fontFamily: 'Arial', background: '#f2f3f5', minHeight: '100vh' }}>
      <div style={{ background: CONFIG.couleurPrincipale, color: 'white', textAlign: 'center', padding: '8px', fontSize: '13px', fontWeight: 'bold' }}>🚚 LIVRAISON GRATUITE dès {CONFIG.livraisonGratuite.toLocaleString()} FCFA - Commandez avant 18h !</div>
      <header style={{ background: 'white', padding: '15px 20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, color: CONFIG.couleurPrincipale, fontSize: '24px' }}>🛒 {CONFIG.nomBoutique}</h1>
        <input value={recherche} onChange={e => setRecherche(e.target.value)} placeholder="🔍 Rechercher riz, poulet..." style={{ flex: 1, minWidth: '180px', padding: '12px 15px', borderRadius: '25px', border: '2px solid #eee', outline: 'none' }} />
        <button onClick={() => setEtape('mes-commandes')} style={{ background: 'white', border: '1px solid #ddd', padding: '10px 14px', borderRadius: '20px', cursor: 'pointer' }}>📦 Mes commandes ({commandes.length})</button>
        <button onClick={() => setEtape('admin-login')} style={{ background: '#111', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '20px', cursor: 'pointer' }}>🔐 Admin</button>
        <button onClick={() => setShowPanier(!showPanier)} style={{ background: CONFIG.couleurPrincipale, color: 'white', border: 'none', padding: '12px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>🛒 Panier ({totalItems}) - {totalPrix.toLocaleString()} F</button>
      </header>

      <div style={{ background: `linear-gradient(90deg, ${CONFIG.couleurPrincipale}, ${CONFIG.couleurBouton})`, color: 'white', margin: '15px', padding: '22px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h2 style={{ margin: '0 0 5px' }}>PROMO DE LA SEMAINE 🔥</h2><p style={{ margin: 0 }}>{CONFIG.slogan} - Jusqu'à -33% sur les fruits & légumes</p></div><div style={{ fontSize: '45px' }}>🥬🍌</div>
      </div>

      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 15px 15px' }}>
        {categories.map(c => (<button key={c} onClick={() => setCat(c)} style={{ whiteSpace: 'nowrap', padding: '10px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: cat === c ? CONFIG.couleurPrincipale : 'white', color: cat === c ? 'white' : '#333', fontWeight: 'bold' }}>{c === 'Tous' ? '🏪 Tous' : c}</button>))}
      </div>

      <div style={{ padding: '0 15px 30px' }}>
        <h3>{cat} ({filtres.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px' }}>
          {filtres.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              {p.promo && <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#ff4757', color: 'white', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>{p.promo}</span>}
              <div style={{ fontSize: '60px', textAlign: 'center', padding: '20px 0 10px', background: '#f8f9fa' }}>{p.emoji}</div>
              <div style={{ padding: '12px' }}>
                <p style={{ fontSize: '11px', color: '#888', margin: '0' }}>{p.cat}</p>
                <p style={{ fontWeight: 'bold', margin: '5px 0', fontSize: '14px', minHeight: '36px' }}>{p.nom}</p>
                <div style={{ display: 'flex', gap: '8px' }}><span style={{ fontWeight: 'bold', color: CONFIG.couleurPrincipale }}>{p.prix.toLocaleString()} F</span>{p.ancien > 0 && <span style={{ textDecoration: 'line-through', color: '#aaa', fontSize: '13px' }}>{p.ancien.toLocaleString()} F</span>}</div>
                {panier[p.id] ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', background: '#e8f5e9', borderRadius: '8px', padding: '5px' }}>
                    <button onClick={() => retirer(p.id)} style={{ background: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>−</button><b>{panier[p.id]}</b><button onClick={() => ajouter(p.id)} style={{ background: CONFIG.couleurPrincipale, color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>+</button>
                  </div>
                ) : (<button onClick={() => ajouter(p.id)} style={{ width: '100%', marginTop: '10px', background: CONFIG.couleurBouton, color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ Ajouter</button>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPanier && (
        <div style={{ position: 'fixed', right: '15px', top: '80px', width: '320px', maxWidth: '90vw', background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', padding: '20px', zIndex: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 style={{ margin: 0 }}>Votre Panier 🛒</h3><button onClick={() => setShowPanier(false)} style={{ border: 'none', background: '#eee', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>X</button></div>
          {totalItems === 0 ? <p style={{ textAlign: 'center', color: '#888' }}>Panier vide</p> : (<>
            {Object.entries(panier).map(([id, q]) => { const p = produits.find(x => x.id == id); return <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}><span>{p.emoji} {p.nom} x{q}</span><b>{(p.prix * q).toLocaleString()} F</b></div> })}
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}><span>Livraison</span><span>{livraison === 0 ? 'Gratuite' : livraison.toLocaleString() + ' F'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}><b>Total:</b><b style={{ color: CONFIG.couleurPrincipale }}>{totalFinal.toLocaleString()} FCFA</b></div>
            <button onClick={() => { setEtape('commande'); setShowPanier(false) }} style={{ width: '100%', background: CONFIG.couleurPrincipale, color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>Continuer - Commander sur le site</button>
          </>)}
        </div>
      )}

      <footer style={{ background: '#111', color: 'white', textAlign: 'center', padding: '20px' }}>
        <p>📍 {CONFIG.quartier} | {CONFIG.horaires}</p>
        <p style={{ fontSize: '12px', color: '#aaa' }}>Site créé pour les petites supérettes - Pour avoir le vôtre, contactez-nous</p>
      </footer>
    </div>
  )
}

export default App