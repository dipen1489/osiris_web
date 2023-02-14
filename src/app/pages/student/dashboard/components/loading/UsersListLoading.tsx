const UsersListLoading = () => {
  const styles = {
    borderRadius: '0.475rem',
    boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
    backgroundColor: '#fff',
    color: '#7e8299',
    fontWeight: '500',
    margin: 'auto',
    width: 'auto',
    padding: '1rem 2rem',

    // top: 'calc(50% - 2rem)',
    // left: 'calc(50% - 4rem)',
  }

  return <div style={{...styles, textAlign: 'center'}}><div ><svg viewBox="-25 -25 100 100" style={{ width: 60 }}>
	<defs>
		<linearGradient id="gr-simple" x1="0" y1="0" x2="100%" y2="100%">
    	<stop stop-color="rgba(255,255,255,.2)" offset="10%"/>
    	<stop stop-color="rgba(255,255,255,.7)" offset="90%"/>
		</linearGradient>
	</defs>	
	<circle className="cls-1" cx="26" cy="27" r="26" stroke="url(#gr-simple)"/>
	<path className="cls-2" d="M25,0A24.92,24.92,0,0,1,42.68,7.32" transform="translate(1 2)">
		<animateTransform 
				 attributeName="transform" 
         type="rotate"
         dur="1s" 
         from="0 26 27"
         to="360 26 27" 
         repeatCount="indefinite"/>
		</path>
</svg>
</div>Please wait while data loading...</div>
}

export {UsersListLoading}
