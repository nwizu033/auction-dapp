import { ethers } from "ethers";
import styles from '../styles/auctions.module.css';
import tokenAbi from '../utils/tokenAbi.json';
import auctionAbi from '../utils/auctionAbi.json';
import { useState } from "react";

const Auctions = () => {
    const contractAddress = '0x5110ad25d8c731CCB9F4883285CA8d8f43942f1d';
    const cusdContractAddress = '0x874069fa1eb16d44d622f2e0ca25eea172369bc1';
    const [showModal, setShowModdal] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showWithdrawProceed, setShowWithdrawProceed] = useState(false);
    const [result, setResult] = useState();
    const [id, setId] = useState();
    const [amount, setAmount] = useState();
   
    const see = async () =>{
        try{
            const { ethereum} = window;
            const accounts = await ethereum.request({ method: "eth_accounts"});

            if(accounts.length !== 0) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, auctionAbi, signer);
                const seeItems = await contract.seeItems();
                setResult(seeItems);
              
            }else{
                alert("Please connect wallet to see items");
            }
        }
        catch(err) {
            console.log(err);
            alert("please install metamask and connect wallet")
        }
    }



    const bid = async () => {

        try{
    
          const {ethereum} = window;
    
              // first approve before bidding
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = await provider.getSigner(); 
          const cusdContract = new ethers.Contract(cusdContractAddress,tokenAbi,signer);
          const approval = await cusdContract.approve(contractAddress, amount);
          alert("Approving, please wait.")
          await approval.wait();
          alert('approved! Wait to bid immediately');
        
          // Implement the bid function
          const contract = new ethers.Contract(contractAddress, auctionAbi, signer);
          const bid = await contract.bid(id,amount);
          await bid.wait();
          alert(` Done: ${bid.hash}`);
    
        } catch(error){
          console.log(error)
          alert(error.message);
        }
    
      }


    //   withdraw bid
      const withdrawBid = async () => {

        try{
    
          const { ethereum } = window;
    
            // Implement the withdraw function
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = await provider.getSigner(); 
            const contract = new ethers.Contract(contractAddress, auctionAbi, signer);
            const withdrawal = await contract.withdrawBid(id);
            alert('Mining in progress, please wait');
            await withdrawal.wait();
            alert('Done! Best of luck next time');
    
    
        } catch(err) {
          alert(err.message);
        }
    
    
      }
    //   withdraw bid proceed
      const withdrawBidProceed = async () => {

        try{
    
          const { ethereum } = window;
    
            // Implement the withdraw proceed function
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = await provider.getSigner(); 
            const contract = new ethers.Contract(contractAddress, auctionAbi, signer);
            const withdrawal = await contract.withdrawAuctionProceed(id);
            alert('Mining in progress, please wait');
            await withdrawal.wait();
            alert('Done! Congratulation!!!');
    
    
        } catch(err) {
          alert(err.message);
        }
    
    
      }

      // function for date display
    const date = (timeStamp) => {
        let dateFormat = new Date(timeStamp);
        return (dateFormat.getDate()+
        '/' + (dateFormat.getMonth()+1)+
        '/' + dateFormat.getFullYear()+
        ' ' + dateFormat.getHours()+
        ':' + dateFormat.getMinutes()+
        ':' + dateFormat.getSeconds()
        );

    }


        return(
            <div>
                <div className={styles.top}>
                <button onClick={see}>Click to see items</button>
            </div>

                <div className={styles.container}>
                 {
                    result?.map((res) => (
                    <div className={styles.card} key={res.itemId}>
                        <h2> {(res.title).toString()}</h2>
                        <h3>Item ID: {(res.itemId).toString()}</h3>
                        <h4>Reward detail: {(res.rewardTitle).toString()}</h4>
                        <h4>Reward Value: {((res.rewardValue)/1e18).toString()} ($NwizuGold)</h4>
                        <h4>Set price: {((res.price)/1e18).toString()} ($cUSD)</h4>
                        <h4>Current bid: {((res.currentBid)/1e18).toString()} ($cUSD)</h4>
                        <p>Start Time: {(date(res.startTime * 1000))}</p>
                        <p>End Time: {(date(res.endTime * 1000))}</p>
                        {(res.withdrawn) ? <p>Withdrawn: <span className={styles.green}>Yes</span></p> : <p> Withdrawn: <span className={styles.red}>No</span></p>}
                        <button onClick={()=> setShowModdal(true)}>Bid</button>
                        <button onClick={()=> setShowWithdraw(true)}>Withdraw Bid</button>
                        {(res.endTime *1000 < Date.now()) ? <button onClick={()=> setShowWithdrawProceed(true)}>Withdraw Auction Proceed</button>: null}
                        {(res.startTime *1000 > Date.now()) ? <p className={styles.yet_to_start}> Auction yet to start</p> :((res.startTime*1000 < Date.now()) && (res.endTime*1000 > Date.now()))?<p className={styles.ongoing}>Auction is ongoing</p> :<p className={styles.ended}>auctions ended</p>}
                    </div>
                    ))
                
                }

                 {showModal ? (
                        <div className={styles.overlay}>
                        <div className={styles.modal}>
                            <button onClick={()=> setShowModdal(false)} className={styles.close}>X</button>  
                            <p>Bid</p>
                            <input type='number' onChange={(e)=>{ setId(e.target.value)}} placeholder='Item ID'/>
                            <input type='number' onChange={(e)=>{ setAmount(e.target.value)}} placeholder='Amount'/>
                            <button onClick={bid}>Bid</button>
                            
                        </div>
                        </div>
                    ) : null}


            {showWithdraw ? (
                <div className={styles.overlay}>
                <div className={styles.modal}>
                    <button onClick={()=> setShowWithdraw(false)} className={styles.close}>X</button>
                    <p>Withdraw Bid</p>
                    <p className={styles.withdraw_statement}>Ensure you are withdrawing from an auction you participated <br/>
                    (Only participants can withdraw their bid)
                    </p>
                    <input type='number' onChange={(e)=>{ setId(e.target.value)}} placeholder='Item ID'/>
                    <button onClick={withdrawBid}>Withdraw Bid</button>
                    
                </div>
                </div>
            ) : null} 


            {showWithdrawProceed ? (
                <div className={styles.overlay}>
                <div className={styles.modal}>
                    <button onClick={()=> setShowWithdrawProceed(false)} className={styles.close}>X</button>
                    <p>Withdraw Auction proceed</p>
                    <p className={styles.withdraw_statement}> You can only withdraw if you're the seller <br/>
                    (Congratulations, please withdraw your auction proceed)
                    </p>
                    <input type='number' onChange={(e)=>{ setId(e.target.value)}} placeholder='Item ID'/>
                    <button onClick={withdrawBidProceed}>Withdraw Bid proceed</button>
                    
                </div>
                </div>
            ) : null}   
                </div>
            </div>
            
        )
    }


export default Auctions;