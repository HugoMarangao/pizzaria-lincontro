import Menu from "@/components/Config/Rotas/Menu";
import {useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UseContext } from '../../hooks/useAuth';
import Principal from "@/components/dasboardAdmin/Principal";
import Pedidos from "@/components/dasboardAdmin/Pedidos";
import Suporte from "@/components/dasboardAdmin/Suporte";
import Produtos from "@/components/dasboardAdmin/Produtos";
export default function DashboardAdmin() {
  const { user, isLoggedIn } = useContext(UseContext);
  const router = useRouter();

  useEffect(() => {
    console.log("Verificando estado do usuário em DashboardAdmin:", { isLoggedIn, user });
    if (!isLoggedIn) {
      router.push('/Login/logar');
    } else if (user && user.identifi !== "admin") {
      router.push('/');
    }
  }, [isLoggedIn, user, router]);
  
  const [activeComponent, setActiveComponent] = useState('principal');

  let Component;
  switch(activeComponent) {
    case 'principal':
      Component = Principal;
      break;
    case 'pedidos':
      Component = Pedidos;
    break;
      case 'produtos':
      Component = Produtos;
    break;
    case 'suporte':
      Component = Suporte;
      break;
    default:
      Component = Principal;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Menu activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <Component/>
    </div>
  )
}

