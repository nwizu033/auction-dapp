import { ethers } from 'ethers';
import styles from '../styles/listing.module.css';
import auction_abi from '../utils/auctionAbi.json';
import { useState } from 'react';

const Listing = () => {
    
    const contractAddress = '0x5110ad25d8c731CCB9F4883285CA8d8f43942f1d';
    const [title, setTitle] = useState();
    const [rewardTitle, setRewardTitle] = useState();
    const [reward, setReward] = useState();
    const [price, setPrice] = useState();
    const [start, setStart] = useState();
    const [end, setEnd] = useState();




    const list = async () => {
        
            try{
                const { ethereum } = window;

                
        if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, auction_abi, signer);
                const listItem = await contract.listItem(title,rewardTitle,reward,price,start,end);
                alert('Listing item, please wait');
                await listItem.wait();
                alert('Item listed successfully');
            }else{
                alert( "Make sure your wallet is connected and fill every detail")
            }
            
        
        } catch(err) {

            console.error(err);
            
        
        }
    }


    return (
        <div className={styles.list_container}>
            <div className={styles.form}>
                <h2 className={styles.list_h2}>List your Item</h2>
                <input type='text' placeholder='Item title'  onChange={(e)=>{setTitle(e.target.value)}}/>
                <input type='text' placeholder='Item reward title(eg. Get 200 $NwizuGold)' onChange={(e)=>{setRewardTitle(e.target.value)}}/>
                <input type='number' placeholder='Item reward value in ($NwizuGold)' onChange={(e)=>{setReward(e.target.value)}}/>
                <input type='number' placeholder='Price in(cusd)' onChange={(e)=>{setPrice(e.target.value)}}/>
                <input type='number' placeholder='Start time in minutes' onChange={(e)=>{setStart(e.target.value)}}/>
                <input type='number' placeholder='End time in minutes' onChange={(e)=>{setEnd(e.target.value)}}/>
                <button type='submit' className={styles.btn} onClick={list}>List</button>
            </div>

        </div>
    );
}
 
export default Listing;