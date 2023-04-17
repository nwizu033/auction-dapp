import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from '../styles/navbar.module.css';
import logo from '../../public/celo__img.png';

const Navbar =()=>{

    const [currentAccount, setCurrentAccount] = useState();
    
    const connectWallet = async () => {
        try{
            const { ethereum } = window;
    
            if(!ethereum) {
                alert("Please install metamask for easy experience ");
                
            }
    
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
    
            setCurrentAccount(accounts[0]);
    
        } catch (error) {
            console.log(error);
        }
    
      }
    
      const shortenAddress = (currentAccount) => `${currentAccount.slice(0, 3)}...${currentAccount.slice(currentAccount.length - 4)}`
    
      return (
        <div className={styles.navbar}>
            <div className={styles.logoSection}>
                <Image src={logo} width={128} height ={70}/>
                <h1>Chinwizu Auction</h1>
            </div>
            <div>
                <Link href='/'>Home</Link>
                <Link href='/auctions'>Auctions</Link>
                <Link href='/listing'>List an item</Link>
            </div>
              <div className={styles.btn_container}>
                  {!currentAccount ?  <button onClick={connectWallet} className={styles.btn}>Connect Wallet</button> :
                  <button className={styles.btn}>Conn: {shortenAddress(currentAccount)}</button>}
              </div>
            

        </div>
    );

}

export default Navbar;
