use serde::Serialize;
use std::{thread, time::Duration};

#[derive(Serialize)]
struct EdgePacket {
    asset_id: &'static str,
    vibration_adc: u16,
    temperature_c: f32,
    source: &'static str,
}

fn main() {
    println!("INDUSTRYWISE edge monitor starter - synthetic values");
    loop {
        // Replace this generator with serial/MQTT input from the ESP32 node.
        let packet = EdgePacket {
            asset_id: "M-04",
            vibration_adc: 180 + (randless_tick() % 35) as u16,
            temperature_c: 68.0,
            source: "synthetic-demo",
        };
        println!("{}", serde_json::to_string(&packet).unwrap());
        thread::sleep(Duration::from_secs(1));
    }
}
fn randless_tick() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now().duration_since(UNIX_EPOCH).unwrap().subsec_millis() as u64
}
