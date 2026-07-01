import { T } from '../../data/tokens';

export default function Toast({ toast, msg, message, type = 'ok', onDismiss }) {
  // Accept: toast={msg,type} object OR msg/message + type props
  const text = toast?.msg || msg || message;
  const kind = toast?.type || type;
  if (!text) return null;
  return (
    <div className="fade" onClick={onDismiss}
      style={{ position:'fixed', top:68, right:20, padding:'10px 16px', borderRadius:6, background:T.white, border:`1px solid ${kind==='ok'?T.greenL:T.redL}40`, color:kind==='ok'?T.greenText:T.redText, fontWeight:600, fontSize:13, zIndex:9999, boxShadow:'0 2px 8px rgba(15,32,68,.1)', maxWidth:360, cursor:onDismiss?'pointer':'default' }}>
      {text}
    </div>
  );
}
