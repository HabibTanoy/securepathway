import { T } from '../../data/tokens';

export const Pill = ({ c=T.blue, children, sm }) => (
  <span style={{ display:'inline-flex',alignItems:'center',padding:sm?'1px 6px':'2px 9px',borderRadius:12,fontSize:sm?9:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',background:`${c}14`,color:c,border:`1px solid ${c}22` }}>{children}</span>
);

export const Bar = ({ pct=0, color=T.blue, h=4 }) => (
  <div style={{ height:h,background:T.silver,borderRadius:2,overflow:'hidden' }}>
    <div className="bar" style={{ width:`${Math.min(pct,100)}%`,height:'100%',background:color,borderRadius:2 }}/>
  </div>
);

export const Card = ({ children, style={}, hover, onClick }) => (
  <div
    className={hover?'hcard':''}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e => (e.key==='Enter'||e.key===' ') && (e.preventDefault(), onClick(e))) : undefined}
    style={{ background:T.white,border:`1px solid ${T.border}`,borderRadius:8,boxShadow:'0 1px 3px rgba(15,32,68,.06)',...style }}>
    {children}
  </div>
);

export const Btn = ({ children, onClick, v='primary', ac=T.blue, disabled, sm, full, style={}, type='button' }) => {
  const vs = {
    primary:{ background:`${ac}12`,color:ac,border:`1.5px solid ${ac}28` },
    solid:  { background:ac,color:'#fff',border:`1.5px solid ${ac}` },
    outline:{ background:T.white,color:ac,border:`1.5px solid ${ac}50` },
    ghost:  { background:'transparent',color:T.steel,border:`1px solid ${T.border}` },
    danger: { background:`${T.red}10`,color:T.redText,border:`1px solid ${T.red}25` },
  };
  return (
    <button type={type} onClick={onClick} disabled={!!disabled}
      style={{ padding:sm?'5px 11px':'9px 18px',fontSize:sm?11:13,borderRadius:6,fontWeight:600,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,width:full?'100%':undefined,transition:'opacity .15s',...vs[v],...style }}>
      {children}
    </button>
  );
};

export const Divider = ({ y=0 }) => <div style={{ height:1,background:T.border,margin:`${y}px 0` }}/>;

export const Avatar = ({ i, size=32, color=T.navy }) => (
  <div style={{ width:size,height:size,borderRadius:'50%',background:color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*.35,fontWeight:800,color:'#fff',flexShrink:0 }}>{i}</div>
);

export const Spinner = () => (
  <div style={{ display:'inline-block',width:18,height:18,border:`2px solid ${T.border}`,borderTop:`2px solid ${T.blue}`,borderRadius:'50%',animation:'spin .7s linear infinite' }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);
