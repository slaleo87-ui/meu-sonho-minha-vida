
import React, { useState } from 'react'
import { supabase } from './supabase'
import {
  Wallet, TrendingUp, TrendingDown, Plus, Target,
  CreditCard, Bell, LayoutDashboard, Users,
  ShoppingBag, Utensils, Home, Heart, PiggyBank
} from 'lucide-react'

export default function App() {
  const [pagina, setPagina] = useState('Início')
  const [despesas, setDespesas] = useState([])
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('Compras')
  const [tipo, setTipo] = useState('despesa')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modo, setModo] = useState('Conjunto')

  const categorias = [
    { nome: 'Compras', limite: 500, icone: ShoppingBag },
    { nome: 'Alimentação', limite: 700, icone: Utensils },
    { nome: 'Moradia', limite: 1200, icone: Home },
    { nome: 'Lazer', limite: 400, icone: Heart },
  ]

  const totalDespesas = despesas
    .filter(d => d.tipo === 'despesa')
    .reduce((s, d) => s + d.valor, 0)

  const totalReceitas = despesas
    .filter(d => d.tipo === 'receita')
    .reduce((s, d) => s + d.valor, 0)

  function adicionarLancamento(e) {
    e.preventDefault()
    if (!descricao || !valor || Number(valor) <= 0) return

    setDespesas([
      ...despesas,
      {
        id: Date.now(),
        descricao,
        valor: Number(valor),
        categoria,
        tipo,
        data: new Date().toLocaleDateString('pt-BR')
      }
    ])

    setDescricao('')
    setValor('')
    setMostrarFormulario(false)
  }

  function gastoCategoria(nome) {
    return despesas
      .filter(d => d.tipo === 'despesa' && d.categoria === nome)
      .reduce((s, d) => s + d.valor, 0)
  }

  const dinheiro = v => v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  return (
    <div className="app">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f3f6fc; font-family: Arial, sans-serif; }
        .app { min-height: 100vh; color: #182943; }
        .top { background: #173f80; color: white; padding: 24px 5%; }
        .top-inner { max-width: 1100px; margin: auto; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; }
        .brand { font-size: 22px; font-weight: bold; }
        .brand small { display: block; font-size: 11px; font-weight: normal; opacity: .8; margin-top: 5px; }
        .mode { padding: 10px; border: 1px solid #ffffff66; border-radius: 10px; background: #ffffff18; color: white; }
        .content { max-width: 1100px; margin: 25px auto; padding: 0 18px 40px; }
        .welcome { margin-bottom: 22px; }
        .welcome h1 { font-size: 25px; margin-bottom: 6px; }
        .muted { color: #718096; font-size: 14px; }
        .nav { display: flex; gap: 8px; overflow-x: auto; margin: 22px 0; padding-bottom: 8px; }
        .nav button { white-space: nowrap; border: 0; background: white; color: #52647d; padding: 12px 16px; border-radius: 10px; cursor: pointer; }
        .nav button.active { background: #2456a1; color: white; }
        .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin: 20px 0; }
        .panel { background: white; padding: 20px; border-radius: 16px; box-shadow: 0 3px 15px #18345c0b; margin-bottom: 18px; }
        .stat-label { color: #718096; font-size: 13px; }
        .stat-value { font-size: 22px; font-weight: bold; margin-top: 12px; }
        .blue { color: #2456a1; }
        .green { color: #16845c; }
        .red { color: #d34c55; }
        .section-title { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 18px; }
        .section-title h2 { font-size: 18px; margin: 0; }
        .btn { background: #2456a1; color: white; border: 0; padding: 12px 16px; border-radius: 10px; cursor: pointer; font-weight: bold; }
        .btn-light { background: #edf3ff; color: #2456a1; }
        .category { margin: 20px 0; }
        .category-head { display: flex; justify-content: space-between; gap: 10px; font-size: 14px; margin-bottom: 9px; }
        .track { height: 9px; background: #edf1f7; border-radius: 20px; overflow: hidden; }
        .fill { height: 100%; background: #3478ce; border-radius: 20px; }
        .warning { background: #fff4df; color: #93600b; padding: 12px; border-radius: 10px; font-size: 13px; margin-top: 10px; }
        .row-item { display: flex; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid #edf0f5; }
        .row-item:last-child { border: 0; }
        .form { display: grid; gap: 12px; }
        input, select { width: 100%; padding: 13px; border: 1px solid #dce3ed; border-radius: 9px; background: white; font-size: 15px; }
        label { font-size: 13px; color: #52647d; display: block; margin-bottom: 6px; }
        .goal { background: #f0f5ff; padding: 15px; border-radius: 12px; margin: 12px 0; }
        .empty { text-align: center; color: #718096; padding: 25px 10px; }
        @media(max-width:650px) {
          .stats { grid-template-columns: 1fr; }
          .stat-value { font-size: 20px; }
          .content { margin-top: 20px; }
          .top { padding: 20px; }
        }
      `}</style>

      <header className="top">
        <div className="top-inner">
          <div className="brand">
            💙 Meu sonho, minha vida
            <small>Organizando hoje, realizando amanhã.</small>
          </div>
          <select className="mode" value={modo} onChange={e => setModo(e.target.value)}>
            <option value="Conjunto">Visão conjunta</option>
            <option value="Pessoal">Visão pessoal</option>
          </select>
        </div>
      </header>

      <main className="content">
        <div className="welcome">
          <h1>Olá! Vamos cuidar dos seus sonhos? 👋</h1>
          <div className="muted">Seu espaço de organização financeira.</div>
        </div>

        <nav className="nav">
          {[
            ['Início', LayoutDashboard],
            ['Lançamentos', Wallet],
            ['Categorias', ShoppingBag],
            ['Metas', Target],
            ['Cartões', CreditCard],
          ].map(([nome, Icon]) => (
            <button key={nome} className={pagina === nome ? 'active' : ''} onClick={() => setPagina(nome)}>
              <Icon size={15} style={{verticalAlign:'middle', marginRight:6}} />
              {nome}
            </button>
          ))}
        </nav>

        {pagina === 'Início' && <>
          <div className="stats">
            <div className="panel">
              <div className="stat-label"><Wallet size={16}/> Saldo dos lançamentos</div>
              <div className="stat-value blue">{dinheiro(totalReceitas-totalDespesas)}</div>
            </div>
            <div className="panel">
              <div className="stat-label"><TrendingUp size={16}/> Receitas registradas</div>
              <div className="stat-value green">{dinheiro(totalReceitas)}</div>
            </div>
            <div className="panel">
              <div className="stat-label"><TrendingDown size={16}/> Despesas registradas</div>
              <div className="stat-value red">{dinheiro(totalDespesas)}</div>
            </div>
          </div>

          <div className="panel">
            <div className="section-title">
              <h2>Resumo por categoria</h2>
              <Bell size={19} color="#2456a1"/>
            </div>
            {categorias.map(c => {
              const gasto = gastoCategoria(c.nome)
              const percentual = gasto / c.limite * 100
              return <div className="category" key={c.nome}>
                <div className="category-head">
                  <strong>{c.nome}</strong>
                  <span>{dinheiro(gasto)} / {dinheiro(c.limite)}</span>
                </div>
                <div className="track">
                  <div className="fill" style={{width: `${Math.min(percentual,100)}%`, background: percentual >= 80 ? '#dc9940' : '#3478ce'}}/>
                </div>
                {percentual >= 80 && <div className="warning">⚠️ Atenção! Você já utilizou {percentual.toFixed(0)}% do limite de {c.nome}.</div>}
              </div>
            })}
          </div>

          <div className="panel">
            <div className="section-title">
              <h2>Últimos lançamentos</h2>
              <button className="btn btn-light" onClick={() => setPagina('Lançamentos')}>Ver todos</button>
            </div>
            {despesas.length === 0
              ? <div className="empty">Seus lançamentos aparecerão aqui.</div>
              : despesas.slice().reverse().slice(0,5).map(d =>
                <div className="row-item" key={d.id}>
                  <div><strong>{d.descricao}</strong><div className="muted">{d.categoria} • {d.data}</div></div>
                  <strong className={d.tipo === 'receita' ? 'green' : 'red'}>{d.tipo === 'receita' ? '+' : '-'}{dinheiro(d.valor)}</strong>
                </div>
              )
            }
          </div>
        </>}

        {pagina === 'Lançamentos' && <div className="panel">
          <div className="section-title">
            <h2>Meus lançamentos</h2>
            <button className="btn" onClick={() => setMostrarFormulario(!mostrarFormulario)}><Plus size={15}/> Novo</button>
          </div>
          {mostrarFormulario && <form className="form" onSubmit={adicionarLancamento}>
            <div><label>Descrição</label><input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex.: Supermercado" required/></div>
            <div><label>Valor (R$)</label><input type="number" min="0.01" step="0.01" value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00" required/></div>
            <div><label>Tipo</label><select value={tipo} onChange={e => setTipo(e.target.value)}><option value="despesa">Despesa</option><option value="receita">Receita</option></select></div>
            <div><label>Categoria</label><select value={categoria} onChange={e => setCategoria(e.target.value)}>{categorias.map(c => <option key={c.nome}>{c.nome}</option>)}</select></div>
            <button className="btn" type="submit">Salvar lançamento</button>
          </form>}
          {despesas.length === 0 ? <div className="empty">Nenhum lançamento registrado ainda.</div> :
            despesas.slice().reverse().map(d => <div className="row-item" key={d.id}>
              <div><strong>{d.descricao}</strong><div className="muted">{d.categoria} • {d.data}</div></div>
              <strong className={d.tipo === 'receita' ? 'green' : 'red'}>{d.tipo === 'receita' ? '+' : '-'}{dinheiro(d.valor)}</strong>
            </div>)
          }
        </div>}

        {pagina === 'Categorias' && <div className="panel">
          <h2>Limites das categorias</h2>
          <p className="muted">Acompanhe quanto pode gastar em cada área.</p>
          {categorias.map(c => <div className="category" key={c.nome}>
            <div className="category-head"><strong>{c.nome}</strong><span>{dinheiro(c.limite)} por mês</span></div>
            <div className="muted">Gasto registrado: {dinheiro(gastoCategoria(c.nome))}</div>
          </div>)}
          <p className="muted">Os limites iniciais são exemplos e poderão ser personalizados.</p>
        </div>}

        {pagina === 'Metas' && <div className="panel">
          <h2><Target size={20}/> Seus sonhos e objetivos</h2>
          <div className="goal"><strong><PiggyBank size={18}/> Reserva de emergência</strong><p className="muted">Sua primeira meta financeira.</p></div>
          <div className="goal"><strong>🏡 Nosso futuro</strong><p className="muted">Um objetivo para construir juntos.</p></div>
          <p className="muted">Na próxima etapa vamos permitir criar metas, definir valores e acompanhar o progresso.</p>
        </div>}

        {pagina === 'Cartões' && <div className="panel">
          <h2><CreditCard size={20}/> Meus cartões</h2>
          <div className="goal"><strong>💜 Nubank</strong><p className="muted">Cadastro e controle manual de cartão.</p></div>
          <p className="muted">Vamos implementar limites, faturas e vencimentos na próxima etapa.</p>
        </div>}

        <div className="muted" style={{textAlign:'center',padding:20}}>
          <Users size={16}/> Espaço pessoal e compartilhado • Meu sonho, minha vida
        </div>
      </main>
    </div>
  )
}
