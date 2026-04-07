//
//  PluginViewController.swift
//  App
//
//  Created by Adrian on 29.03.2026.
//

import UIKit
import Capacitor

class PluginViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView?.scrollView.showsVerticalScrollIndicator = false
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
