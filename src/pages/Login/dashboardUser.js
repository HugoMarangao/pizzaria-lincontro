
import MenuUser from "@/components/Config/Rotas/MenuUser";
import {useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UseContext } from '../../hooks/useAuth';
import PrincipalUser from "@/components/dasboardUser/Principal ";
import PedidosUser from "@/components/dasboardUser/Pedidos";
import Suporte from "@/components/dasboardAdmin/Suporte";
export default function DashboardUser() {
  const { user, isLoggedIn } = useContext(UseContext);
  const router = useRouter();

  useEffect(() => {
    console.log("Verificando estado do usuário em DashboardUser:", { isLoggedIn, user });
    if (!isLoggedIn) {
      router.push('/Login/logar');
    } else if (user && user.identifi !== "user") {
      router.push('/');
    }
  }, [isLoggedIn, user, router]);
  
  const [activeComponent, setActiveComponent] = useState('principal');

  let Component;
  switch(activeComponent) {
    case 'principal':
      Component = PrincipalUser;
      break;
    case 'pedidos':
      Component = PedidosUser;
      break;
    case 'suporte':
      Component = Suporte;
      break;
    default:
      Component = PrincipalUser;
  }

  return (
    <div style={{ display: 'flex' }}>
      <MenuUser activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <Component/>
    </div>
  )
}


