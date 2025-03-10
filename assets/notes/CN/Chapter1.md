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


### 3.2 Point-to-Point Networks

- **Definition**: Direct links between pairs of nodes (unicast).

- **Examples**: Internet, leased lines.

- **Pros**: Scalable, efficient for large networks.

- **Cons**: Expensive (requires routers/switches).

  
![P2PTopology.png](/assets/notes/CN/images/ptp-topology.png)

## 4. Point-to-Point Network Architectures

  

### 4.1 Circuit-Switched Networks

- **Definition**: Dedicated path reserved for entire session.

- **Steps**:  
1. Circuit establishment.  
2. Data transfer.  
3. Circuit termination.  

- **Examples**: Traditional telephone networks.

- **Pros**: Guaranteed **Quality of Service (QoS)**: Ensures consistent performance (e.g., fixed delay, bandwidth), Constant transmission rate.

- **Cons**: Bandwidth waste (idle time), inflexible.

  

### 4.2 Packet-Switched Networks

- **Definition**: Data split into packets; resources shared on-demand.

- **Types**:

  - **Virtual Circuit (Connection-Oriented)**:

    - Predefined path (e.g., ATM).

    - Pros: Ordered delivery, security.

  - **Datagram (Connectionless)**:

    - No predefined path (e.g., Internet).

- **Pros**: Flexibility, no state management.

- **Cons**: Unpredictable delays, packet loss.

- **Key Concepts**:

  - **Statistical Multiplexing**: Dynamic resource sharing.

  - **Store-and-Forward**: Packets buffered at routers.

  - **Queue Delay/Packet Loss**: Due to congestion.
  

---

  

## 5. Key Takeaways

1. **Scope Matters**: PAN < LAN < MAN < WAN in coverage.

2. **Service Types**: Connection-oriented (reliable) vs. connectionless (flexible).

3. **Transmission Tech**: Broadcast (shared medium) vs. point-to-point (dedicated links).

4. **Switching**: Circuit-switched (dedicated path) vs. packet-switched (dynamic routing).

5. **Trade-offs**: QoS (Quality of Service) vs. efficiency, scalability vs. cost.