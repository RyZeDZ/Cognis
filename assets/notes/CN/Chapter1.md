# Classification of Computer Networks  


## 1. Classification by Scope  
Networks are categorized based on their physical size and coverage:  

| Type | Full Name | Coverage | Example |  
|------|-----------|----------|---------|  
| **PAN** | Personal Area Network | Personal devices (up to 10m) | Wireless communication between a smartphone and smartwatch |  
| **LAN** | Local Area Network | Buildings/campus (up to 1km) | Office printers, university lab networks |  
| **MAN** | Metropolitan Area Network | City-wide (<100 km) | Cable TV networks, city-wide Wi-Fi |  
| **WAN** | Wide Area Network | Countries/continents | Internet |  

**Key Characteristics**:  
- **PAN**: Device autonomy (e.g., Bluetooth).  
- **LAN**: High-speed, resource sharing (e.g., file servers).  
- **MAN**: Hybrid infrastructure (e.g., fiber-optic cables).  
- **WAN**: Millions of machines, subnets (e.g., global Internet).  


---

## 2. Network Services  

### 2.1 Connection-Oriented Service  
- **Definition**: Establishes a dedicated path before data transfer.  
- **Features**:  
  - Reliable data transfer, flow/congestion control.  
  - Requires **handshaking** (e.g., old telephone systems).  
- **Pros**: Guaranteed delivery, ordered packets.  
- **Cons**: Higher latency due to setup/teardown.  

![Handshake.png](/assets/notes/CN/images/Handshake-illustration.png)

### 2.2 Connectionless Service  
- **Definition**: No pre-established path; packets routed independently.  
- **Features**:  
  - Each packet contains destination address (e.g., postal system).  
  - Faster transmission (no handshaking).  
- **Pros**: Flexibility, scalability.  
- **Cons**: Unreliable (packet loss/disorder), no QoS (Quality of Service) guarantees.  

**Comparison Table**:  
| Feature | Connection-Oriented | Connectionless |  
|---------|---------------------|----------------|  
| Setup | Requires handshaking | No setup |  
| Reliability | High | Low |  
| Use Case | Voice calls | Email, web browsing |  

---

## 3. Transmission Technologies  

### 3.1 Broadcast Networks  
- **Definition**: All devices share a single communication channel.  
- **Examples**: Ethernet, Wireless LAN.  
- **Topologies**: Bus, Ring.  
- **Pros**: Low cost, simple setup.  
- **Cons**: Limited scalability, collision risks (requires arbitration).  

![RingTopology.png](/assets/notes/CN/images/ring-topology.png)
![BusTopology.png](/assets/notes/CN/images/bus-topology.png)

